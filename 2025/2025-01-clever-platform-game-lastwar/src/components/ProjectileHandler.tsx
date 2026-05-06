import { useRef, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { useProjectileStore } from '@/store/projectileStore';
import { TimeManager } from '@/utils/core-utils/timer/time-manager';
import { playSoundEffect } from '@core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

interface ProjectileConfig {
  readonly SPEED: number;
  readonly SIZE: number;
  readonly MAX_DISTANCE: number;
  readonly BASE_FREQUENCY: number;
  readonly COLOR: number;
}

const PROJECTILE_CONFIG: ProjectileConfig = {
  SPEED: 2,
  SIZE: 0.5,
  MAX_DISTANCE: 220,
  BASE_FREQUENCY: 2000,
  COLOR: 0xff0000,
};

interface ProjectileHandlerProps {
  followPosition?: THREE.Vector3;
}

export function ProjectileHandler({
  followPosition = new THREE.Vector3(),
}: ProjectileHandlerProps) {
  const lastFireTime = useRef<number>(0);
  const didFireRef = useRef(false);
  const { scene } = useThree(); // Get scene from React Three Fiber
  const sceneRef = useRef<THREE.Scene>(scene);
  const { projectileRange, projectileSpeed } = useGameStore(); // Remove isPlaying from destructuring
  const { projectiles } = useProjectileStore(); // Keep for rendering

  // Update sceneRef when scene changes
  useEffect(() => {
    sceneRef.current = scene;
  }, [scene]);

  const createProjectile = (position: THREE.Vector3) => {
    const geometry = new THREE.SphereGeometry(PROJECTILE_CONFIG.SIZE);
    const material = new THREE.MeshPhongMaterial({
      color: PROJECTILE_CONFIG.COLOR,
      shininess: 100,
    });

    const mesh = new THREE.Mesh(geometry, material);
    if (!mesh) {
      console.warn('⚠️ Failed to create projectile mesh!');
      return null;
    }

    mesh.name = 'projectile';
    mesh.position.copy(position);

    useProjectileStore.getState().addProjectile(mesh, position);

    return mesh;
  };

  const spawnBurst = (scene: THREE.Scene, position: THREE.Vector3) => {
    const { burstCount } = useGameStore.getState();
    console.log(`Spawning burst with ${burstCount} projectiles`);

    void playSoundEffect(SOUND_GROUPS.sfx.throw_fruit);

    const spreadX = 1;
    const startX = position.x - (spreadX * (burstCount - 1)) / 2;

    for (let i = 0; i < burstCount; i++) {
      const spawnPos = position.clone();
      spawnPos.x = startX + i * spreadX;
      spawnPos.z -= i * 1;

      const projectile = createProjectile(spawnPos);
      if (projectile) scene.add(projectile);
    }
  };

  const destroyProjectile = (projectile: any) => {
    if (!projectile || projectile.destroyed) return;

    if (projectile.mesh.parent) {
      projectile.mesh.parent.remove(projectile.mesh);
    }

    projectile.mesh.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });

    projectile.destroyed = true;
    useProjectileStore.getState().removeProjectile(projectile.id);
  };

  useEffect(() => {
    const timeManager = TimeManager.getInstance();

    const unsubUpdate = timeManager.update((dt) => {
      // Guard: skip if dt is invalid (prevents stuck projectiles after long idle)
      if (!dt || dt <= 0) return;

      if (!sceneRef.current) return;

      // Only update if game is playing
      if (!timeManager.isPlaying()) return;

      const { burstSpeed } = useGameStore.getState();
      const currentTime = Date.now();
      const timeSinceLastFire = currentTime - lastFireTime.current;
      const firingInterval = PROJECTILE_CONFIG.BASE_FREQUENCY / (1 + burstSpeed);

      if (timeSinceLastFire >= firingInterval && !didFireRef.current) {
        didFireRef.current = true;
        const spawnPosition = followPosition.clone();
        spawnPosition.z -= 2;
        spawnBurst(sceneRef.current, spawnPosition);
        lastFireTime.current = currentTime;
      }

      // Get latest projectiles from store inside the update loop
      const currentProjectiles = useProjectileStore.getState().projectiles;

      currentProjectiles.forEach((projectile) => {
        if (projectile.destroyed) return;

        // Use delta time for frame-rate independent movement (target ~60fps)
        projectile.mesh.position.z -= projectileSpeed * dt * 60;
        projectile.position.copy(projectile.mesh.position);

        if (projectile.mesh.position.z < projectile.startPosition.z - projectileRange) {
          destroyProjectile(projectile);
        }
      });

      // Reset fire flag
      didFireRef.current = false;
    });

    return () => {
      unsubUpdate();
      // Clear projectiles only on unmount
      useProjectileStore.getState().clearProjectiles();
    };
  }, [followPosition, projectileRange, projectileSpeed]); // Remove isPlaying from deps to prevent cleanup on pause

  const renderedProjectiles = useMemo(() => {
    return projectiles.map((projectile, index) => (
      <primitive key={index} object={projectile.mesh} />
    ));
  }, [projectiles]);

  return <>{renderedProjectiles}</>;
}
