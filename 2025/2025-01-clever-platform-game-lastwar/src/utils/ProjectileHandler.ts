import * as THREE from 'three';
import { Cube } from './CubeUtility';
import { Vector3D } from '@/types/game';

interface ProjectileConfig {
  readonly SIZE: number;
  readonly DEFAULT_VELOCITY: Vector3D;
  readonly SPEED: number;
  readonly UPDATE_INTERVAL: number;
}

const PROJECTILE_CONFIG: ProjectileConfig = {
  SIZE: 2,
  DEFAULT_VELOCITY: {
    x: 0,
    y: -0.01,
    z: 0,
  },
  SPEED: 1,
  UPDATE_INTERVAL: 16, // milliseconds
} as const;

interface ProjectileOptions {
  damage?: number;
  speed?: number;
  size?: number;
  color?: string;
}

export class ProjectileHandler {
  private static activeProjectiles: Set<Cube> = new Set();

  public static CreateNewProjectile(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    options: ProjectileOptions = {},
  ): Cube {
    const {
      damage = 1,
      speed = PROJECTILE_CONFIG.SPEED,
      size = PROJECTILE_CONFIG.SIZE,
      color = '#FF0000',
    } = options;

    const projectile = new Cube({
      height: size,
      depth: size,
      width: size,
      velocity: { ...PROJECTILE_CONFIG.DEFAULT_VELOCITY },
      position: {
        x: origin.x,
        y: origin.y,
        z: origin.z,
      },
      DoUseTexture: false,
      color: color,
    });

    // Add custom properties to the projectile
    const customProjectile = projectile as Cube & {
      damage: number;
      speed: number;
      direction: THREE.Vector3;
      isActive: boolean;
      update: (ground: THREE.Mesh) => void;
    };

    customProjectile.damage = damage;
    customProjectile.speed = speed;
    customProjectile.direction = direction.normalize();
    customProjectile.isActive = true;

    // Override update method
    customProjectile.update = function (): void {
      if (!this.isActive) return;

      // Update position based on direction and speed
      this.position.x += this.direction.x * this.speed;
      this.position.y += this.direction.y * this.speed;
      this.position.z += this.direction.z * this.speed;

      // Update collision boundaries
      this.updateSides();

      // Optional: Deactivate projectile if it goes too far
      if (Math.abs(this.position.z) > 1000) {
        this.isActive = false;
        ProjectileHandler.removeProjectile(this);
      }
    };

    this.activeProjectiles.add(customProjectile);
    return customProjectile;
  }

  public static removeProjectile(projectile: Cube): void {
    this.activeProjectiles.delete(projectile);
  }

  public static getActiveProjectiles(): Set<Cube> {
    return this.activeProjectiles;
  }

  public static clearAllProjectiles(): void {
    this.activeProjectiles.clear();
  }

  public static updateAllProjectiles(ground: THREE.Mesh): void {
    this.activeProjectiles.forEach((projectile) => {
      if ((projectile as any).update) {
        (projectile as any).update(ground);
      }
    });
  }
}
