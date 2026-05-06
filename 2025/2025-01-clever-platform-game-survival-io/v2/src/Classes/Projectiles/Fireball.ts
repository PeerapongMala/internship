import ProjectileHandler from '@class/ProjectileHandler';
import * as THREE from 'three';
import { SkillName, useSkillStore } from '@/store/skillStore';
import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';
import { playSoundEffect } from '@/utils/core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

interface Enemy extends THREE.Object3D {
  IsEnemy: boolean;
  IsDied?: boolean;
  EntityData: {
    takeDamage: (damage: number, isCritical: boolean) => void;
  };
  visible: boolean;
}

interface FireballArgs {
  spawnposition: {
    x: number;
    y: number;
    z: number;
  };
  scene: THREE.Scene;
  speed?: number;
  color?: string;
  direction?: THREE.Vector3; // เพิ่มพารามิเตอร์สำหรับกำหนดทิศทาง
}

class Fireball extends ProjectileHandler {
  protected damage: number;
  protected target: Enemy | null;
  protected isDestroyed: boolean;
  protected direction: THREE.Vector3; // ทิศทางที่กำหนดตั้งแต่เริ่มต้น
  protected lifetime: number; // อายุของ Fireball (วินาที)
  protected maxLifetime: number; // อายุสูงสุด (วินาที)

  constructor(
    args: Partial<FireballArgs> = {
      spawnposition: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
  ) {
    super({
      modelURL: PUBLIC_ASSETS_LOCATION.model.weapon.bullet,
      spawnPosition: args.spawnposition!,
      scene: args.scene!,
      speed: args.speed || 20,
      color: args.color || 'orange',
    });
    this.damage = 10;
    this.target = null;
    this.isDestroyed = false;
    this.lifetime = 0;
    this.maxLifetime = 5; // อายุสูงสุด 5 วินาที (ปรับได้ตามต้องการ)

    // กำหนดทิศทางการเคลื่อนที่ตั้งแต่เริ่มต้น
    if (args.direction) {
      // ถ้ามีการส่งทิศทางมา ให้ใช้ทิศทางนั้น
      this.direction = args.direction.clone().normalize();
    } else {
      // ถ้าไม่มี ให้หาศัตรูที่ใกล้ที่สุดและกำหนดทิศทางไปยังศัตรูนั้น
      const closestEnemy = this.findClosestEnemy();
      if (closestEnemy) {
        this.direction = new THREE.Vector3()
          .subVectors(closestEnemy.position, this.DisplayModel.position)
          .normalize();
      } else {
        // ถ้าไม่มีศัตรู ให้ยิงไปข้างหน้า (ทิศ -Z)
        this.direction = new THREE.Vector3(0, 0, -1);
      }
    }

    // หมุน Fireball ให้หันไปตามทิศทางการเคลื่อนที่
    this.setRotationFromDirection();

    // 🔥 ตั้งค่า IsProjectile เพื่อป้องกัน friendly fire
    (this.DisplayModel as any).IsProjectile = true;
    (this.DisplayModel as any).ProjectileType = 'Fireball';

    this.DisplayModel.OnTouch = function (this: Fireball, TouchFrom: Enemy) {
      // 🛡️ ป้องกันไม่ให้ชนกับ player
      if ((TouchFrom as any).isPlayer) {
        console.log('🛡️ Fireball ignored player collision (friendly fire protection)');
        return;
      }

      if (TouchFrom.IsEnemy && TouchFrom.visible) {
        TouchFrom.EntityData.takeDamage(
          useSkillStore.getState().currentSkillLevel[SkillName.FIREBALL] * 4,
          // (AvailableCardInfo[SkillName.FIREBALL].level || 0) * 4,
          true,
        );

        void playSoundEffect(SOUND_GROUPS.sfx.enemy_hit);

        this.destroy();
        return;
      }
    }.bind(this);

    this.DisplayModel.OnUpdate = this.updateProjectile.bind(this);
  }

  // ฟังก์ชันหมุน Fireball ให้หันไปตามทิศทางการเคลื่อนที่
  private setRotationFromDirection(): void {
    // คำนวณมุมในแนวราบ (รอบแกน Y)
    const horizontalAngle = Math.atan2(this.direction.x, this.direction.z);

    // คำนวณมุมในแนวตั้ง (รอบแกน X)
    const horizontalDistance = Math.sqrt(
      this.direction.x * this.direction.x + this.direction.z * this.direction.z,
    );
    const verticalAngle = Math.atan2(this.direction.y, horizontalDistance);

    // ตั้งค่าการหมุน
    this.DisplayModel.rotation.set(
      -verticalAngle, // หมุนขึ้น-ลง
      horizontalAngle, // หมุนซ้าย-ขวา
      0,
    );
  }

  OnTouch(target: Enemy): void {
    console.log('Fireball collided with:', target);
  }

  findClosestEnemy(): Enemy | null {
    let closestEnemy: Enemy | null = null;
    let closestDistance: number = Infinity;

    (window as any).entities.forEach((entity: { EntityObject: Enemy }) => {
      if (entity.EntityObject.IsEnemy && entity.EntityObject.visible) {
        const distance = this.DisplayModel.position.distanceTo(
          entity.EntityObject.position,
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = entity.EntityObject;
        }
      }
    });

    return closestEnemy;
  }

  // ฟังก์ชัน destroy สำหรับทำลาย Fireball
  private destroy(): void {
    this.isDestroyed = true;
    this.DisplayModel.visible = false;
    this.DisplayModel.position.set(10000, 10000, 10000);
  }

  updateProjectile(deltaTime: number = 0): void {
    if (this.isDestroyed) {
      return;
    }

    // คำนวณเวลาที่ผ่านไป (ใช้ deltaTime แทนการคำนวณจาก Date.now())
    this.lifetime += deltaTime;

    // ตรวจสอบว่าหมดอายุหรือยัง
    if (this.lifetime >= this.maxLifetime) {
      console.log('Fireball expired after', this.lifetime.toFixed(2), 'seconds');
      this.destroy();
      return;
    }

    // เคลื่อนที่ไปตามทิศทางที่กำหนดไว้ตั้งแต่เริ่มต้น (ใช้ deltaTime สำหรับ frame-independent movement)
    const movement = this.direction.clone().multiplyScalar(this.speed * deltaTime);
    this.DisplayModel.position.add(movement);
  }
}

export { Fireball };
