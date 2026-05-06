import * as THREE from "three";
import { createTextTexture } from "./TextTextureUltity.js";
import { CollisionDetector } from "./CollisionHandler";
import EntityHandler from "./EntityHandler.js";

class Cube extends THREE.Mesh {
  constructor({
    width,
    height,
    depth,
    color = "#00ff00",
    velocity = { x: 0, y: 0, z: 0 },
    position = { x: 0, y: 0, z: 0 },
    zAcceleration = false,
    DoUseTexture = false, // Set to false to use color only
    IsPortal = false,
    DisplayText = "5",
  }) {
    // Create materials with number textures
    const materials = [
      new THREE.MeshBasicMaterial({ map: createTextTexture("1") }), // Right face
      new THREE.MeshBasicMaterial({ map: createTextTexture("2") }), // Left face
      new THREE.MeshBasicMaterial({ map: createTextTexture("3") }), // Top face
      new THREE.MeshBasicMaterial({ map: createTextTexture("4") }), // Bottom face
      new THREE.MeshBasicMaterial({ map: createTextTexture(DisplayText) }), // Front face
      new THREE.MeshBasicMaterial({ map: createTextTexture("6") }), // Back face
    ];

    // If DoUseTexture is false, use solid color materials
    if (!DoUseTexture) {
      const solidColorMaterial = new THREE.MeshStandardMaterial({ color });
      for (let i = 0; i < materials.length; i++) {
        materials[i] = solidColorMaterial;
      }
    }

    // Call the constructor of THREE.Mesh with the geometry and materials
    super(new THREE.BoxGeometry(width, height, depth), materials);

    this.IsTouched = false;
    this.IsPortal = IsPortal;
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.position.set(position.x, position.y, position.z);

    this.velocity = velocity;
    this.gravity = -0.002;
    this.zAcceleration = zAcceleration;

    this.EntityData = new EntityHandler(this);

    this.updateBoundaries();
  }

  update(ground) {
    if (this.IsPortal) {
      this.position.z += 0.1;
      this.updateBoundaries();

      const collisionResult = CollisionDetector.boxCollision({
        box1: this,
        box2: window.GameManager.PlayerCharacter,
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

  applyGravity(ground) {
    this.velocity.y += this.gravity;

    this.updateBoundaries();

    const collisionResult = CollisionDetector.boxCollision({
      box1: this,
      box2: ground,
    });

    if (collisionResult) {
      const friction = 0.5;
      this.velocity.y *= friction;
      this.velocity.y = -this.velocity.y;
    } else {
      this.position.y += this.velocity.y;
    }

    this.updateBoundaries(); // Update boundaries after position changes
  }

  updateBoundaries() {
    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;
  }

  OnUpdate() {}

  OnTouch(CollideFrom) {}
}

export { Cube };
