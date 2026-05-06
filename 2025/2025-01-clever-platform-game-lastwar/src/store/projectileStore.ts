import { create } from 'zustand';
import * as THREE from 'three';
import { nanoid } from 'nanoid';
interface Projectile {
  id: string;
  mesh: THREE.Mesh;
  position: THREE.Vector3;
  startPosition: THREE.Vector3;
  boundingBox: THREE.Box3;
  destroyed: boolean;
}

interface ProjectileState {
  projectiles: Projectile[];
  addProjectile: (mesh: THREE.Mesh | null, position: THREE.Vector3) => void;
  removeProjectile: (id: string) => void;
  clearProjectiles: () => void;
  updateProjectilePositions: () => void;
}

export const useProjectileStore = create<ProjectileState>((set) => ({
  projectiles: [],

  addProjectile: (mesh, position) => {
    if (!mesh) {
      console.warn('⚠️ Tried to add a projectile, but mesh is null!');
      return;
    }

    set((state) => {
      const id = nanoid();
      return {
        projectiles: [
          ...state.projectiles,
          {
            id,
            mesh,
            position: position.clone(),
            startPosition: position.clone(),
            boundingBox: new THREE.Box3().setFromObject(mesh),
            destroyed: false,
          },
        ],
      };
    });
  },

  removeProjectile: (id) => {
    set((state) => ({
      projectiles: state.projectiles.filter((p) => {
        if (p.id === id) {
          // Cleanup projectile
          if (p.mesh.parent) p.mesh.parent.remove(p.mesh);
          if (p.mesh.geometry) p.mesh.geometry.dispose();
          if (Array.isArray(p.mesh.material)) {
            p.mesh.material.forEach((mat) => mat.dispose());
          } else {
            p.mesh.material.dispose();
          }
          return false; // Remove this projectile
        }
        return true; // Keep other projectiles
      }),
    }));
  },

  clearProjectiles: () => {
    set((state) => {
      state.projectiles.forEach((projectile) => {
        if (projectile.mesh.parent) projectile.mesh.parent.remove(projectile.mesh);
        if (projectile.mesh.geometry) projectile.mesh.geometry.dispose();
        if (Array.isArray(projectile.mesh.material)) {
          projectile.mesh.material.forEach((mat) => mat.dispose());
        } else {
          projectile.mesh.material.dispose();
        }
      });
      return { projectiles: [] };
    });
  },

  updateProjectilePositions: () => {
    set((state) => ({
      projectiles: state.projectiles.map((projectile) => ({
        ...projectile,
        boundingBox: new THREE.Box3().setFromObject(projectile.mesh),
      })),
    }));
  },
}));
