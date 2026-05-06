import ProjectileHandler from '@class/ProjectileHandler';
import * as THREE from 'three';
import { Fireball } from './Fireball';
import { SkillName, useSkillStore } from '@/store/skillStore';
import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';

interface Enemy extends THREE.Object3D {
  IsEnemy: boolean;
  visible: boolean;
  position: THREE.Vector3;
  EntityObject?: Enemy;
}

interface DroneArgs {
  scene: THREE.Scene;
  ProjectileOwner?: THREE.Group | THREE.Object3D;
  spawnposition: {
    x: number;
    y: number;
    z: number;
  };
  color?: string;
  speed?: number;
  angle?: number;
}

class Drone extends ProjectileHandler {
  protected damage: number;
  // protected angle: number;
  // protected scene: THREE.Scene;
  private cooldown: number;

  constructor(args: Partial<DroneArgs> = {}) {
    super({
      modelURL: PUBLIC_ASSETS_LOCATION.model.weapon.drone,
      scene: args.scene!,
      spawnPosition: args.spawnposition || { x: 0, y: 0, z: 0 },
      ProjectileOwner: args.ProjectileOwner || window.PlayerCharacter,
      color: args.color || 'red',
      speed: args.speed || 0.01,
      angle: args.angle || 0,
    });
    this.damage = 5;
    this.cooldown = 1;

    // 🔥 ตั้งค่า IsProjectile เพื่อป้องกัน friendly fire
    // Drone ไม่ได้ชนโดยตรง แต่ตั้งค่าไว้เผื่อ
    (this.DisplayModel as any).IsProjectile = true;
    (this.DisplayModel as any).ProjectileType = 'Drone';

    this.DisplayModel.OnUpdate = this.updateDrone.bind(this);
  }

  private findClosestEnemy(displayModel: THREE.Object3D): Enemy | null {
    let closestEnemy: Enemy | null = null;
    let closestDistance: number = 10;

    (window as any).entities.forEach((entity: { EntityObject: Enemy }) => {
      if (entity.EntityObject.IsEnemy && entity.EntityObject.visible) {
        const distance = displayModel.position.distanceTo(entity.EntityObject.position);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = entity.EntityObject;
        }
      }
    });

    return closestEnemy;
  }

  private updateDrone = (deltaTime: number = 0.016) => {
    if (!this.DisplayModel) return;

    this.cooldown -= deltaTime * 0.3125; // 0.005 / 0.016 = 0.3125
    if (this.findClosestEnemy(this.DisplayModel) && this.cooldown <= 0) {
      this.cooldown = 1;
      for (
        let index = 0;
        index < useSkillStore.getState().currentSkillLevel[SkillName.DRONE];
        // index < AvailableCardInfo[SkillName.DRONE].level;
        index++
      ) {
        const newFireball = new Fireball({
          spawnposition: {
            x: this.DisplayModel.position.x,
            y: this.DisplayModel.position.y,
            z: this.DisplayModel.position.z,
          },
          scene: this.scene,
          color: 'yellow',
        });
        this.scene?.add(newFireball.getDisplayModel());
      }
    }

    const owner = this.ProjectileOwner;
    if (owner?.position) {
      const radius = 10;
      this.angle += this.speed * deltaTime * 62.5; // normalize speed to deltaTime (0.01 / 0.016 * 100)
      this.DisplayModel.position.x = owner.position.x + radius * Math.cos(this.angle);
      this.DisplayModel.position.z = owner.position.z + radius * Math.sin(this.angle);
    } else {
      console.error('ProjectileOwner or its position is undefined.');
    }
  };
}

export { Drone };
