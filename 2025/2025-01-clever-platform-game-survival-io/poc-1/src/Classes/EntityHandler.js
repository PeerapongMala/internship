import { CollisionDetector } from "../Classes/CollisionHandler.js";
import * as THREE from "three";

class EntityHandler {
  constructor(EntityObject, is3DModel = false) {
    this.EntityObject = EntityObject;
    this.is3DModel = is3DModel; // ตรวจสอบว่าเป็นโมเดล 3D หรือไม่

    this.currentHP = 10;
    // Initialize Hitbox attributes
    this.updateBoundaries();

    this.velocity = EntityObject.velocity;

    window.entities.push(this);
  }

  updateBoundaries() {
    if (this.is3DModel) {
      // สำหรับโมเดล 3D ให้ใช้ขนาดที่มาจาก BoundingBox
      const boundingBox = new THREE.Box3().setFromObject(this.EntityObject);
      this.right = boundingBox.max.x;
      this.left = boundingBox.min.x;
      this.top = boundingBox.max.y;
      this.bottom = boundingBox.min.y;
      this.front = boundingBox.max.z;
      this.back = boundingBox.min.z;
    } else {
      // สำหรับกล่องแดงใช้ตำแหน่งและขนาดที่กำหนด
      this.right = this.EntityObject.position.x + this.EntityObject.width / 2;
      this.left = this.EntityObject.position.x - this.EntityObject.width / 2;
      this.bottom = this.EntityObject.position.y - this.EntityObject.height / 2;
      this.top = this.EntityObject.position.y + this.EntityObject.height / 2;
      this.front = this.EntityObject.position.z + this.EntityObject.depth / 2;
      this.back = this.EntityObject.position.z - this.EntityObject.depth / 2;
    }
  }

  static update() {
    window.entities = window.entities.filter(
      (Entity) => Entity.EntityObject.visible
    ); // Remove entities that are not visible

    window.entities.forEach((Entity) => {
      Entity.updateBoundaries(); // Update boundaries before checking collisions

      Entity.velocity = Entity.EntityObject.velocity;

      // Checking for each collision
      window.entities.forEach((TargetEntity) => {
        if (
          TargetEntity !== Entity &&
          Entity.EntityObject.visible &&
          TargetEntity.EntityObject.visible
        ) {
          const collisionResult = CollisionDetector.boxCollision({
            box1: TargetEntity,
            box2: Entity,
          });

          if (collisionResult) {
            Entity.EntityObject.OnTouch(TargetEntity.EntityObject);
          }
        }
      });

      if (Entity.EntityObject.OnUpdate) {
        Entity.EntityObject.OnUpdate();
      }
    });
  }

  OnEntityRemoved() {
    const indexnum = window.entities.indexOf(this);
    if (indexnum > -1) {
      window.entities.splice(indexnum, 1);
    }
  }

  takeDamage(damageAmount, forceDamage) {
    if (
      performance.now() > (this.nextHitTime || performance.now() - 100) ||
      forceDamage
    ) {
      if (this.EntityObject.isPlayer) {
        console.log("Player taking 1 damage");
      } else {
        console.log("Entity taking " + damageAmount + " damage");
      }
      this.currentHP -= damageAmount;
      this.nextHitTime =
        performance.now() + (this.EntityObject.isPlayer ? 1000 : 300);
    }

    if (this.currentHP <= 0) {
      this.isDied = true;
      this.onEntityDied();
    }
  }

  onEntityDied() {}
}

export default EntityHandler;
