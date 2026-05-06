import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';
import { SOUND_GROUPS } from '@/assets/public-sound';
import { playSoundEffect } from '@/utils/core-utils/sound';
import ProjectileHandler from '@class/ProjectileHandler';
import * as THREE from 'three';

interface Enemy extends THREE.Object3D {
  IsEnemy: boolean;
  IsDied: boolean;
  EntityData?: {
    takeDamage: (damage: number, force?: boolean) => void;
    isDied?: boolean;
  };
}

interface IceballArgs {
  spawnposition: {
    x: number;
    y: number;
    z: number;
  };
  ProjectileOwner?: THREE.Group | THREE.Object3D;
  color?: string;
  angle?: number;
  speed?: number;
  radius?: number; // 🆕 ระยะห่างจากตัวละคร
  cubeOffset?: { x: number; y: number; z: number }; // 🎲 ตำแหน่งในกล่อง (มุมกล่อง)
}

class Iceball extends ProjectileHandler {
  protected damage: number;
  private radius: number; // 🆕 ระยะห่างจากตัวละคร
  private cubeOffset: { x: number; y: number; z: number }; // 🎲 offset ในกล่อง

  constructor(args: Partial<IceballArgs>) {
    super({
      modelURL: PUBLIC_ASSETS_LOCATION.model.weapon.rowel,
      spawnPosition: args.spawnposition || { x: 0, y: 0, z: 0 },
      ProjectileOwner: args.ProjectileOwner || window.PlayerCharacter,
      color: args.color || 'blue',
      speed: args.speed || 0.05,
      angle: args.angle || 0,
    });

    this.damage = 5;
    this.radius = args.radius || 3; // 🆕 ตั้งค่าระยะห่างจากตัวละคร
    this.cubeOffset = args.cubeOffset || { x: 1, y: 0, z: 0 }; // 🎲 ตำแหน่งมุมกล่อง

    // 🔥 ตั้งค่า IsProjectile เพื่อป้องกัน friendly fire
    (this.DisplayModel as any).IsProjectile = true;
    (this.DisplayModel as any).ProjectileType = 'Iceball';

    this.DisplayModel.OnTouch = (TouchFrom: Enemy) => {
      // 🛡️ ป้องกันไม่ให้ชนกับ player
      if ((TouchFrom as any).isPlayer) {
        console.log('🛡️ Iceball ignored player collision (friendly fire protection)');
        return;
      }

      if (TouchFrom.IsEnemy && !TouchFrom.IsDied) {
        // ✅ เรียก takeDamage แทน set IsDied โดยตรง
        if (
          TouchFrom.EntityData &&
          typeof TouchFrom.EntityData.takeDamage === 'function'
        ) {
          TouchFrom.EntityData.takeDamage(this.damage, false);

          void playSoundEffect(SOUND_GROUPS.sfx.enemy_hit);

          console.log('⚔️ Iceball dealt', this.damage, 'damage to enemy');
        } else {
          // Fallback: ถ้าไม่มี EntityData ให้ฆ่าเลย (backward compatibility)
          console.warn('⚠️ Enemy has no EntityData.takeDamage, using fallback');
          TouchFrom.IsDied = true;
        }
      }
    };

    this.DisplayModel.OnUpdate = this.updateIceball.bind(this);
  }

  private updateIceball = (deltaTime: number = 0.016) => {
    if (!this.DisplayModel) return;

    const owner = this.ProjectileOwner;
    if (owner?.position) {
      //  อพเดทมมการหมนทงกลอง (หมนพรอมกน)
      const speed = this.speed * deltaTime * 62.5; // normalize speed to deltaTime
      this.angle += speed; // หมนแนวนอน (ทงกลองหมนรอบแกน Y)

      //  คำนวณตำแหนงแบบหมนกลอง (Rotation Matrix)
      // หมนรอบแกน Y (แนวนอน)
      const cosA = Math.cos(this.angle);
      const sinA = Math.sin(this.angle);

      // หมนตำแหนงมมกลองดวย rotation matrix
      const x = this.cubeOffset.x * cosA - this.cubeOffset.z * sinA;
      const y = this.cubeOffset.y; // ไมหมนในแนวตง (คงท)
      const z = this.cubeOffset.x * sinA + this.cubeOffset.z * cosA;

      // 🎯 ปรับจุดศูนย์กลางกล่อง (ยกจากเท้าขึ้นมาที่กึ่งกลางลำตัว)
      const centerOffset = 2.5; // ยกขึ้นประมาณครึ่งความสูงตัวละคร

      // ตงตำแหนงสดทาย (relative to owner) พรอมปรบขนาด
      this.DisplayModel.position.x = owner.position.x + x * this.radius;
      this.DisplayModel.position.y = owner.position.y + y * this.radius + centerOffset; // เพิ่ม offset แนวตั้ง
      this.DisplayModel.position.z = owner.position.z + z * this.radius;
    } else {
      console.error('ProjectileOwner or its position is undefined.');
    }
  };
}

export { Iceball };
