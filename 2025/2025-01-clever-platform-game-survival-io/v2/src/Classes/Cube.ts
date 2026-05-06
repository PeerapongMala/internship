import * as THREE from 'three';
import { createTextTexture } from './TextTextureUltity';
import { CollisionDetector } from './CollisionHandler';
import EntityHandler, { EntityObject } from './EntityHandler';
import { ModelFileLoader } from '../utils/core-utils/3d/model-file-loader';

// ---- Types ----
interface Velocity {
  x: number;
  y: number;
  z: number;
}

interface Position {
  x: number;
  y: number;
  z: number;
}

interface CubeParams {
  modelURL?: string;
  width: number;
  height: number;
  depth: number;
  color?: string;
  velocity?: Velocity;
  position?: Position;
  zAcceleration?: boolean;
  DoUseTexture?: boolean;
  IsPortal?: boolean;
  DisplayText?: string;
}

class Cube extends THREE.Group {
  // Public properties
  public IsTouched: boolean;
  public IsPortal: boolean;
  public width: number;
  public height: number;
  public depth: number;
  public velocity: Velocity;
  public gravity: number;
  public zAcceleration: boolean;
  public EntityData: EntityHandler;

  // Boundaries
  public right!: number;
  public left!: number;
  public bottom!: number;
  public top!: number;
  public front!: number;
  public back!: number;

  constructor({
    modelURL,
    width,
    height,
    depth,
    color = '#00ff00',
    velocity = { x: 0, y: 0, z: 0 },
    position = { x: 0, y: 0, z: 0 },
    zAcceleration = false,
    DoUseTexture = false,
    IsPortal = false,
    DisplayText = '5',
  }: CubeParams) {
    // Create materials with number textures
    const materials: THREE.Material[] = [
      new THREE.MeshBasicMaterial({ map: createTextTexture('1') }), // Right
      new THREE.MeshBasicMaterial({ map: createTextTexture('2') }), // Left
      new THREE.MeshBasicMaterial({ map: createTextTexture('3') }), // Top
      new THREE.MeshBasicMaterial({ map: createTextTexture('4') }), // Bottom
      new THREE.MeshBasicMaterial({ map: createTextTexture(DisplayText) }), // Front
      new THREE.MeshBasicMaterial({ map: createTextTexture('6') }), // Back
    ];

    // If DoUseTexture is false, use solid color materials
    if (!DoUseTexture) {
      const solidColorMaterial = new THREE.MeshStandardMaterial({
        wireframe: true,
        color,
        opacity: 1,
        transparent: true,
      });
      for (let i = 0; i < materials.length; i++) {
        materials[i] = solidColorMaterial;
      }
    }

    // // Call the constructor of THREE.Mesh
    // super(new THREE.BoxGeometry(width, height, depth), materials);
    super();

    if (modelURL) {
      ModelFileLoader({
        src: modelURL,
        debugEnabled: false,
        scale: 0.5,
        parentObj: this,
      });
    } else {
      // Create a box mesh and add it to the group
      const boxMesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        materials,
      );
      this.add(boxMesh);

      console.warn(`Cube created without modelURL. Using box geometry instead.`);
    }

    this.IsTouched = false;
    this.IsPortal = IsPortal;
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.position.set(position.x, position.y, position.z);

    this.velocity = velocity;
    this.gravity = -0.002;
    this.zAcceleration = zAcceleration;

    this.EntityData = new EntityHandler(this as unknown as EntityObject);

    this.updateBoundaries();
  }

  public update(ground: THREE.Mesh) {
    if (this.IsPortal) {
      this.position.z += 0.1;
      this.updateBoundaries();

      const collisionResult = CollisionDetector.boxCollision({
        box1: CollisionDetector.createCollisionBoxFromMesh(this),
        box2: CollisionDetector.createCollisionBoxFromMesh(
          // (window as any).GameManager.PlayerCharacter,
          window.PlayerCharacter as unknown as THREE.Object3D,
        ),
      });

      if (collisionResult) {
        this.IsTouched = true;
      }
      return;
    }

    if (this.zAcceleration) this.velocity.z += 0.0003;

    this.position.x += this.velocity.x;
    this.position.z += this.velocity.z;

    this.updateBoundaries();
    this.applyGravity(ground);
  }

  private applyGravity(ground: THREE.Mesh) {
    this.velocity.y += this.gravity;

    this.updateBoundaries();

    const collisionResult = CollisionDetector.boxCollision({
      box1: CollisionDetector.createCollisionBoxFromMesh(this),
      box2: CollisionDetector.createCollisionBoxFromMesh(ground),
    });

    if (collisionResult) {
      const friction = 0.5;
      this.velocity.y *= friction;
      this.velocity.y = -this.velocity.y;
    } else {
      this.position.y += this.velocity.y;
    }

    this.updateBoundaries();
  }

  private updateBoundaries() {
    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;
  }

  public OnUpdate(): void {
    // Intended for override
  }

  public OnTouch(_CollideFrom: THREE.Object3D): void {
    // console.log('Touched by', CollideFrom);
    // Intended for override
  }
}

export { Cube };
