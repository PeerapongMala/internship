import ProjectileHandler from '@class/ProjectileHandler'; // , { ProjectileArgs }
import * as THREE from 'three';
import { getParticleSystem } from '@/Utilities/getParticleSystem';
import { playSoundEffect } from '@/utils/core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

// ---- Interfaces for args and particle system ----
interface MolotovArgs {
  spawnPosition: {
    x: number;
    y: number;
    z: number;
  };
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  color?: string;
}

// Rough type for particle system (adjust if you know exact return type)
interface ParticleSystem {
  update: (delta: number) => void;
  destroy: () => void;
}

// ---- Molotov Class ----
class Molotov extends ProjectileHandler {
  protected damage: number;
  // private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private decayTime: number;
  private fireEffect: ParticleSystem;

  constructor(args: Partial<MolotovArgs>) {
    // constructor(args: ProjectileArgs) {
    super({
      // modelURL: PUBLIC_ASSETS_LOCATION.model.weapon.molotov,
      scene: args.scene,
      // camera: args.camera,
      spawnPosition: args.spawnPosition || { x: 0, y: 0, z: 0 },
      color: args.color || 'red',
      customSize: { width: 5, height: 1, depth: 5 },
    });

    this.scene = args.scene || new THREE.Scene();
    this.camera = args.camera || new THREE.PerspectiveCamera();

    this.damage = 10;
    let decayTime = performance.now() + 3000;
    this.decayTime = decayTime;

    // 🔥 ตั้งค่า IsProjectile เพื่อป้องกัน friendly fire
    (this.DisplayModel as any).IsProjectile = true;
    (this.DisplayModel as any).ProjectileType = 'Molotov';

    // Setup OnTouch
    this.DisplayModel.OnTouch = function (TouchFrom: any) {
      // 🛡️ ป้องกันไม่ให้ชนกับ player
      if (TouchFrom.isPlayer) {
        console.log('🛡️ Molotov ignored player collision (friendly fire protection)');
        return;
      }

      if (TouchFrom.IsEnemy && TouchFrom.visible && !(performance.now() > decayTime)) {
        TouchFrom.EntityData.takeDamage(1);
        return;
      }
    }.bind(this);

    // Setup OnUpdate
    this.DisplayModel.OnUpdate = this.updateMolotov.bind(this);

    // Fire particle effect
    const fireEffect = getParticleSystem({
      camera: this.camera,
      emitter: this.DisplayModel,
      parent: this.scene,
      rate: 150,
      texture: 'image/fire.png',
    }) as ParticleSystem;

    this.fireEffect = fireEffect;

    void playSoundEffect(SOUND_GROUPS.sfx.molotov);
  }

  public OnTouch(target: unknown): void {
    console.log('RPG collided with:', target);
  }

  private updateMolotov(deltaTime: number = 0.016): void {
    if (performance.now() > this.decayTime) {
      this.fireEffect.destroy();
      return;
    }
    this.scene?.remove(this.DisplayModel);
    this.fireEffect.update(deltaTime);
  }
}

export { Molotov };
