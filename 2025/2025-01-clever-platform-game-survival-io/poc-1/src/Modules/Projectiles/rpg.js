import ProjectileHandler from "../../Classes/ProjectileHandler";
import * as THREE from "three";

import { Explosion } from "../../context/gamePage/components/explosion";
class RPG extends ProjectileHandler {
  constructor(
    args = {
      spawnposition: {
        x: 0,
        y: 0,
        z: 0,
      },
      scene: null,
    }
  ) {
    super(args);
    this.damage = 10;
    this.speed = 10;
    this.target = null;
    this.scene = args.scene;
    this.DisplayModel.OnTouch = function (TouchFrom) {
      if (TouchFrom.IsEnemy && TouchFrom.visible) {
        // ตรวจสอบว่าศัตรูสามารถมองเห็นได้
        TouchFrom.IsDied = true;
        this.isDestroyed = true;

        return;
      }
    }.bind(this);

    this.DisplayModel.OnUpdate = this.updateProjectile.bind(this);
  }
  OnTouch(target) {
    console.log("RPG collided with:", target);
  }

  findClosestEnemy() {
    let closestEnemy = null;
    let closestDistance = Infinity;

    window.entities.forEach((entity) => {
      if (entity.EntityObject.IsEnemy && entity.EntityObject.visible) {
        // ตรวจสอบว่าศัตรูสามารถมองเห็นได้
        const distance = this.DisplayModel.position.distanceTo(
          entity.EntityObject.position
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = entity.EntityObject;
        }
      }
    });

    return closestEnemy;
  }

  updateProjectile() {
    if (this.isDestroyed) {
      if (!this.isEmited) {
        this.isEmited = true;
        this.explosion = new Explosion(this.scene, this.DisplayModel.position);
        this.scene.add(this.explosion.particles);
      }

      window.entities.forEach((entity) => {
        if (entity.EntityObject.IsEnemy && entity.EntityObject.visible) {
          // ตรวจสอบว่าศัตรูสามารถมองเห็นได้
          const distance = this.DisplayModel.position.distanceTo(
            entity.EntityObject.position
          );
          if (distance < 5) {
            entity.EntityObject.EntityData.takeDamage(2, true);
          }
        }
      });

      this.DisplayModel.visible = false;
      this.DisplayModel.position.set(10000, 10000, 10000); // ย้ายออกจากหน้าจอ
      return;
    }

    if (!this.target || this.target.IsDied || !this.target.visible) {
      // ถ้าไม่มีเป้าหมาย เป้าหมายตายแล้ว หรือมองไม่เห็น
      this.target = this.findClosestEnemy();
    }

    if (this.target) {
      const direction = new THREE.Vector3()
        .subVectors(this.target.position, this.DisplayModel.position)
        .normalize();
      this.DisplayModel.position.add(
        direction.multiplyScalar(this.speed * 0.01)
      ); // Adjust speed factor as necessary
    } else {
      this.DisplayModel.position.z -= 0.1; // Default movement if no enemy is found
    }
  }
}

export { RPG };
