import ProjectileHandler from '@class/ProjectileHandler';
import * as THREE from 'three';
import { Explosion } from '@/scenes/scene-gameplay/components/gameplay/components/explosion';
import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';
import { playSoundEffect } from '@/utils/core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

interface RPGArgs {
  spawnposition: {
    x: number;
    y: number;
    z: number;
  };
  scene: THREE.Scene;
  speed?: number;
}

interface Enemy extends THREE.Object3D {
  IsEnemy: boolean;
  visible: boolean;
  IsDied: boolean;
  EntityData: {
    takeDamage: (damage: number, force: boolean) => void;
  };
}

interface DisplayModel extends THREE.Object3D {
  OnTouch: (TouchFrom: Enemy) => void;
  OnUpdate: (deltaTime: number) => void;
  position: THREE.Vector3;
  visible: boolean;
}

export class RPG extends ProjectileHandler {
  private readonly damage: number = 10;
  // public speed: number = 10;
  private target: Enemy | null = null;
  // public scene: THREE.Scene;
  private isDestroyed: boolean = false;
  private isEmited: boolean = false;
  private explosion?: Explosion;
  declare protected DisplayModel: DisplayModel;

  constructor(args: RPGArgs) {
    super({
      modelURL: PUBLIC_ASSETS_LOCATION.model.weapon.rocket,
      spawnPosition: args.spawnposition || { x: 0, y: 0, z: 0 },
      scene: args.scene || new THREE.Scene(),
      speed: args.speed === undefined ? 10 : args.speed,
    });
    // this.scene = args.scene;

    if (this.DisplayModel) {
      this.setupDisplayModel();
      // void playSoundEffect(SOUND_GROUPS.sfx.rpg);
    }
  }

  private setupDisplayModel(): void {
    // 🔥 ตั้งค่า IsProjectile เพื่อป้องกัน friendly fire
    (this.DisplayModel as any).IsProjectile = true;
    (this.DisplayModel as any).ProjectileType = 'RPG';

    this.DisplayModel.OnTouch = ((TouchFrom: Enemy) => {
      // 🛡️ ป้องกันไม่ให้ชนกับ player
      if ((TouchFrom as any).isPlayer) {
        console.log('🛡️ RPG ignored player collision (friendly fire protection)');
        return;
      }

      if (TouchFrom.IsEnemy && TouchFrom.visible && !TouchFrom.IsDied) {
        // ✅ เรียก takeDamage แทน set IsDied โดยตรง
        if (
          TouchFrom.EntityData &&
          typeof TouchFrom.EntityData.takeDamage === 'function'
        ) {
          TouchFrom.EntityData.takeDamage(this.damage, false);

          void playSoundEffect(SOUND_GROUPS.sfx.enemy_hit);

          console.log('💥 RPG dealt', this.damage, 'damage to enemy');
        } else {
          // Fallback: ถ้าไม่มี EntityData ให้ฆ่าเลย (backward compatibility)
          console.warn('⚠️ Enemy has no EntityData.takeDamage, using fallback');
          TouchFrom.IsDied = true;
        }
        this.isDestroyed = true;
      }
    }).bind(this);

    this.DisplayModel.OnUpdate = this.updateProjectile.bind(this);
  }

  private findClosestEnemy(): Enemy | null {
    let closestEnemy: Enemy | null = null;
    let closestDistance = Infinity;

    if (!window.entities) return null;

    for (const entity of window.entities) {
      const entityObject = entity.EntityObject as unknown as Enemy;
      if (entityObject.IsEnemy && entityObject.visible) {
        const distance = this.DisplayModel.position.distanceTo(entityObject.position);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = entityObject;
        }
      }
    }

    return closestEnemy;
  }

  private updateProjectile(deltaTime: number = 0): void {
    if (this.isDestroyed) {
      if (!this.isEmited) {
        this.isEmited = true;
        if (!this.scene) return;
        this.explosion = new Explosion(this.scene, this.DisplayModel.position);
        this.scene.add(this.explosion.particles);
        void playSoundEffect(SOUND_GROUPS.sfx.rpg);
      }

      if (window.entities) {
        for (const entity of window.entities) {
          const entityObject = entity.EntityObject as unknown as Enemy;
          if (entityObject.IsEnemy && entityObject.visible) {
            const distance = this.DisplayModel.position.distanceTo(entityObject.position);
            if (distance < 5) {
              entityObject.EntityData.takeDamage(2, true);
            }
          }
        }
      }

      this.DisplayModel.visible = false;
      this.DisplayModel.position.set(10000, 10000, 10000);
      return;
    }

    if (!this.target || this.target.IsDied || !this.target.visible) {
      this.target = this.findClosestEnemy();
    }

    if (this.target) {
      const direction = new THREE.Vector3()
        .subVectors(this.target.position, this.DisplayModel.position)
        .normalize();
      this.DisplayModel.position.add(direction.multiplyScalar(this.speed * deltaTime));
    } else {
      this.DisplayModel.position.z -= 0.1 * deltaTime;
    }
  }

  public OnTouch(target: Enemy): void {
    console.log('RPG collided with:', target);
  }
}
