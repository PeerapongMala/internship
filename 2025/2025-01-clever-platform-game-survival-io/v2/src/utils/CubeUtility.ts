import * as THREE from 'three';
import { createTextTexture } from '../utils/TextTextureUtility';
import { CollisionDetector } from '../utils/CollisionHandler';
import { Vector3D } from '../types/game';

interface CubeConstructorParams {
  width: number;
  height: number;
  depth: number;
  color?: string;
  velocity?: Vector3D;
  position?: Vector3D;
  zAcceleration?: boolean;
  DoUseTexture?: boolean;
  IsPortal?: boolean;
  DisplayText?: string;
  DoInvisible?: boolean;
  IsWall?: boolean;
}

export class Cube extends THREE.Mesh {
  width: number;
  height: number;
  depth: number;
  right: number;
  left: number;
  bottom: number;
  top: number;
  front: number;
  back: number;
  velocity: Vector3D;
  gravity: number;
  zAcceleration: boolean;
  IsPortal: boolean;
  IsWall: boolean;
  IsTouched: boolean;
  TheTextDisplay: THREE.Texture;
  DisplayModel?: THREE.Object3D;
  WallHP?: number;

  constructor({
    width,
    height,
    depth,
    color = '#00ff00',
    velocity = { x: 0, y: 0, z: 0 },
    position = { x: 0, y: 0, z: 0 },
    zAcceleration = false,
    DoUseTexture = true,
    IsPortal = false,
    DisplayText = '5',
    DoInvisible = false,
    IsWall = false,
  }: CubeConstructorParams) {
    const TheTextDisplay = createTextTexture(DisplayText);
    const materials = [
      new THREE.MeshBasicMaterial({ map: createTextTexture('', IsWall) }), // Right
      new THREE.MeshBasicMaterial({ map: createTextTexture('', IsWall) }), // Left
      new THREE.MeshBasicMaterial({ map: createTextTexture('', IsWall) }), // Top
      new THREE.MeshBasicMaterial({ map: createTextTexture('', IsWall) }), // Bottom
      new THREE.MeshBasicMaterial({ map: TheTextDisplay }), // Front
      new THREE.MeshBasicMaterial({ map: createTextTexture('', IsWall) }), // Back
    ];

    if (IsPortal || IsWall) {
      materials.forEach((material) => {
        material.transparent = true;
        material.opacity = 1;
      });
    }

    super(
      new THREE.BoxGeometry(width, height, depth),
      DoUseTexture
        ? materials
        : new THREE.MeshStandardMaterial({
            color,
            transparent: true,
            opacity: 0.5,
          }),
    );

    this.IsTouched = false;
    this.IsPortal = IsPortal;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.TheTextDisplay = TheTextDisplay;
    this.position.set(position.x, position.y, position.z);
    this.velocity = velocity;
    this.gravity = -0.002;
    this.zAcceleration = zAcceleration;
    this.visible = !DoInvisible;
    this.IsWall = IsWall;

    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;
  }

  updateSides(): void {
    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;
    this.bottom = this.IsWall
      ? this.position.y - 5 - this.height / 2
      : this.position.y - this.height / 2;
    this.top = this.IsWall
      ? this.position.y - 5 + this.height / 2
      : this.position.y + this.height / 2;
    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;
  }

  update(ground: THREE.Mesh): void {
    if (this.IsPortal) {
      this.position.z += 0.2;
      const collisionResult = CollisionDetector.boxCollision({
        box1: CollisionDetector.createCollisionBoxFromMesh(this),
        box2: CollisionDetector.createCollisionBoxFromMesh(
          (window as any).GameManager.PlayerCharacter,
          // (window as any).PlayerCharacter
        ),
      });

      if (collisionResult) {
        this.IsTouched = true;
      }
      this.updateSides();

      if (this.WallHP !== undefined) {
        (this.material as THREE.MeshBasicMaterial[])[4].map = createTextTexture(
          this.WallHP.toString(),
          this.IsWall,
        );
        (this.material as THREE.MeshBasicMaterial[])[4].map!.needsUpdate = true;
      }

      if (this.DisplayModel) {
        this.DisplayModel.position.set(
          this.position.x,
          this.position.y - 5,
          this.position.z,
        );
        this.DisplayModel.rotation.z += 0.05;
      }
      return;
    }

    this.updateSides();

    if (this.zAcceleration) this.velocity.z += 0.0003;

    this.position.x += this.velocity.x;
    this.position.z += this.velocity.z;
    this.position.x = Math.min(Math.max(this.position.x, -12), 12);

    this.applyGravity(ground);

    if (this.DisplayModel) {
      this.DisplayModel.position.set(this.position.x, this.position.y, this.position.z);
    }
  }

  applyGravity(ground: THREE.Mesh): void {
    this.velocity.y += this.gravity;

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
  }
}
