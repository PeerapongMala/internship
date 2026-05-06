import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../utils/SoundController';
import { createTextTexture } from '../utils/TextTextureUtility';
import { characterState } from './CharacterController';
import { useCharacterStore } from '../store/characterStore';

interface WallConfig {
  readonly WIDTH: number;
  readonly HEIGHT: number;
  readonly DEPTH: number;
  readonly SPEED: number;
  readonly SPAWN_DISTANCE: number;
  readonly LANE_WIDTH: number;
  readonly FONT_SIZE: number;
  readonly SPAWN_INTERVAL: number;
}

const WALL_CONFIG: WallConfig = {
  WIDTH: 30,
  HEIGHT: 10,
  DEPTH: 2,
  SPEED: 0.2,
  SPAWN_DISTANCE: -220,
  LANE_WIDTH: 15,
  FONT_SIZE: 24,
  SPAWN_INTERVAL: 6000,
};

export interface WallEffect {
  type: 'hp' | 'burst' | 'burstSpeed';
  value: number;
  displayText: string;
}

interface WallSide {
  effect: WallEffect;
  mesh: THREE.Group;
  lastCollisionTime?: number;
  hp: number;
}

interface Wall {
  position: THREE.Vector3;
  leftSide: WallSide;
  rightSide: WallSide;
}

const WALL_EFFECTS = {
  // HP: { type: "hp" as const, value: 1, displayText: "💥 +1 HP" },
  BURST: { type: 'burst' as const, value: 1, displayText: '🔫 +1 burst' },
  BURST_SPEED: {
    type: 'burstSpeed' as const,
    value: 0.1,
    displayText: '+0.1 burst speed',
  },
} as const;

interface WallProps {
  speed?: number;
  onCollision?: (effect: WallEffect) => void;
}

export function WallHandler({ onCollision }: WallProps) {
  const walls = useRef<Wall[]>([]);
  const { isPlaying, setBurstCount, setBurstSpeed } = useGameStore();
  const lastSpawnTime = useRef(0);
  const gameStartTime = useRef(0);
  const lastSpawnPosition = useRef<number | null>(null);
  const { currentLane } = useCharacterStore();

  useEffect(() => {
    if (isPlaying) {
      gameStartTime.current = Date.now();
      lastSpawnTime.current = gameStartTime.current;
      lastSpawnPosition.current = null;
    }
  }, [isPlaying]);

  const createWallMaterial = (effect: WallEffect) => {
    const materials = Array(6)
      .fill(null)
      .map((_, index) => {
        const texture = createTextTexture(index === 4 ? effect.displayText : '', true, {
          font: {
            normal: `bold ${WALL_CONFIG.FONT_SIZE}px Arial`,
            wall: `bold ${WALL_CONFIG.FONT_SIZE}px Arial`,
          },
        });
        return new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 1,
        });
      });
    return materials;
  };

  const createWallSide = (isLeft: boolean, position: THREE.Vector3) => {
    const group = new THREE.Group();

    // Create barrier mesh
    const barrierGeometry = new THREE.BoxGeometry(
      WALL_CONFIG.WIDTH / 2,
      WALL_CONFIG.HEIGHT,
      WALL_CONFIG.DEPTH,
    );

    const barrierMaterial = new THREE.MeshPhongMaterial({
      color: isLeft ? 0x00ff00 : 0xff0000,
      transparent: true,
      opacity: 0.6,
    });

    const barrierMesh = new THREE.Mesh(barrierGeometry, barrierMaterial);

    // Position the barrier
    const xOffset = isLeft ? -WALL_CONFIG.LANE_WIDTH / 2 : WALL_CONFIG.LANE_WIDTH / 2;
    barrierMesh.position.set(xOffset, 0, 0);

    // Create text mesh
    const textGeometry = new THREE.BoxGeometry(
      WALL_CONFIG.WIDTH / 2,
      WALL_CONFIG.HEIGHT,
      0.1,
    );

    const effect = Math.random() < 0.5 ? WALL_EFFECTS.BURST : WALL_EFFECTS.BURST_SPEED;

    const textMaterials = createWallMaterial(effect);
    const textMesh = new THREE.Mesh(textGeometry, textMaterials);
    textMesh.position.set(xOffset, 0, -WALL_CONFIG.DEPTH / 2 - 0.1);

    group.add(barrierMesh);
    group.add(textMesh);
    group.position.copy(position);

    return {
      effect,
      mesh: group,
      lastCollisionTime: 0,
      hp: 1,
    };
  };

  const createWall = () => {
    const position = new THREE.Vector3(
      0,
      WALL_CONFIG.HEIGHT / 2,
      WALL_CONFIG.SPAWN_DISTANCE,
    );

    const leftSide = createWallSide(true, position);
    const rightSide = createWallSide(false, position);

    const wall = {
      position,
      leftSide,
      rightSide,
    };

    return wall;
  };

  const handleCollision = (
    wall: Wall,
    isLeftSide: boolean,
    parent: THREE.Object3D | null,
  ) => {
    if (!parent) return;

    const side = isLeftSide ? wall.leftSide : wall.rightSide;
    const currentTime = Date.now();

    // Add cooldown check (500ms)
    if (side.lastCollisionTime && currentTime - side.lastCollisionTime < 500) {
      return;
    }

    console.log(
      'Collision detected with',
      isLeftSide ? 'left' : 'right',
      'wall, effect:',
      side.effect.displayText,
    );

    // Apply effect and play sound
    side.lastCollisionTime = currentTime;
    playSound('boost_hit');

    // Add effect values to current values
    const { burstCount, burstSpeed } = useGameStore.getState();
    if (side.effect.type === 'burst') {
      setBurstCount(burstCount + side.effect.value);
    } else if (side.effect.type === 'burstSpeed') {
      setBurstSpeed(burstSpeed + side.effect.value);
    }

    // Call the onCollision callback with the effect
    if (onCollision) {
      onCollision(side.effect);
    }

    // Destroy the wall side
    if (isLeftSide && wall.leftSide.mesh.parent) {
      wall.leftSide.mesh.parent.remove(wall.leftSide.mesh);
      wall.leftSide.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      wall.leftSide.mesh = new THREE.Group();
    } else if (!isLeftSide && wall.rightSide.mesh.parent) {
      wall.rightSide.mesh.parent.remove(wall.rightSide.mesh);
      wall.rightSide.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      wall.rightSide.mesh = new THREE.Group();
    }

    console.log('Wall side destroyed:', isLeftSide ? 'left' : 'right');
  };

  const cleanupWalls = () => {
    walls.current.forEach((wall) => {
      // Clean up left side
      const leftBarrier = wall.leftSide.mesh.children[0] as THREE.Mesh;
      const leftText = wall.leftSide.mesh.children[1] as THREE.Mesh;

      if (leftBarrier.geometry) leftBarrier.geometry.dispose();
      if (leftBarrier.material instanceof THREE.Material) {
        leftBarrier.material.dispose();
      }

      if (leftText.geometry) leftText.geometry.dispose();
      if (Array.isArray(leftText.material)) {
        leftText.material.forEach((material: THREE.Material) => material.dispose());
      }

      // Clean up right side
      const rightBarrier = wall.rightSide.mesh.children[0] as THREE.Mesh;
      const rightText = wall.rightSide.mesh.children[1] as THREE.Mesh;

      if (rightBarrier.geometry) rightBarrier.geometry.dispose();
      if (rightBarrier.material instanceof THREE.Material) {
        rightBarrier.material.dispose();
      }

      if (rightText.geometry) rightText.geometry.dispose();
      if (Array.isArray(rightText.material)) {
        rightText.material.forEach((material: THREE.Material) => material.dispose());
      }
    });
    walls.current = [];
  };

  const checkCollision = (wall: Wall) => {
    // Check collision based on current lane
    if (currentLane === 'left' && wall.leftSide) {
      // Check left side collision
      handleCollision(wall, true, wall.leftSide.mesh.parent);
    } else if (currentLane === 'right' && wall.rightSide) {
      // Check right side collision
      handleCollision(wall, false, wall.rightSide.mesh.parent);
    }
  };

  useFrame((state) => {
    if (!isPlaying) return;

    const currentTime = Date.now();
    const timeSinceStart = currentTime - gameStartTime.current;
    const spawnCycle = Math.floor(timeSinceStart / WALL_CONFIG.SPAWN_INTERVAL);
    const expectedPosition =
      WALL_CONFIG.SPAWN_DISTANCE +
      (spawnCycle * WALL_CONFIG.SPEED * WALL_CONFIG.SPAWN_INTERVAL) / 1000;

    // Only spawn if we haven't spawned at this position yet
    if (currentTime - lastSpawnTime.current >= WALL_CONFIG.SPAWN_INTERVAL) {
      const wall = createWall();
      state.scene.add(wall.leftSide.mesh);
      state.scene.add(wall.rightSide.mesh);
      walls.current.push(wall);
      lastSpawnTime.current = currentTime;
      lastSpawnPosition.current = expectedPosition;
    }

    // Get character position
    const characterWorldPos = new THREE.Vector3();
    state.camera.parent?.getWorldPosition(characterWorldPos);

    // Update walls and check collisions
    for (let i = walls.current.length - 1; i >= 0; i--) {
      const wall = walls.current[i];
      wall.position.z += WALL_CONFIG.SPEED;
      wall.leftSide.mesh.position.z = wall.position.z;
      wall.rightSide.mesh.position.z = wall.position.z;

      // Simple collision check - just check Z distance and current lane
      const characterZ = characterWorldPos.z;
      const wallZ = wall.position.z;

      //const characterBox = new THREE.Box3().setFromObject(character);
      // const wallBox = new THREE.Box3().setFromObject(wall.leftSide.mesh);
      // if (characterBox.intersectsBox(wallBox)) {

      // Only check if wall is close enough on Z axis
      if (Math.abs(wallZ - characterZ) < WALL_CONFIG.DEPTH) {
        console.log('Current lane:', characterState.targetLane); // Debug log

        // Check collision based on actual lane (0 = left, 1 = right)
        if (characterState.targetLane === 0 && wall.leftSide.mesh.parent) {
          // Clean up left side
          const leftBarrier = wall.leftSide.mesh.children[0] as THREE.Mesh;
          const leftText = wall.leftSide.mesh.children[1] as THREE.Mesh;

          if (leftBarrier.geometry) leftBarrier.geometry.dispose();
          if (leftBarrier.material instanceof THREE.Material) {
            leftBarrier.material.dispose();
          }

          if (leftText.geometry) leftText.geometry.dispose();
          if (Array.isArray(leftText.material)) {
            leftText.material.forEach((material: THREE.Material) => material.dispose());
          }

          // We're in left lane
          checkCollision(wall);
        } else if (characterState.targetLane === 1 && wall.rightSide.mesh.parent) {
          // We're in right lane
          state.scene.remove(wall.rightSide.mesh);
          wall.rightSide.mesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.geometry.dispose();
              if (Array.isArray(child.material))
                child.material.forEach((mat) => mat.dispose());
              else child.material.dispose();
            }
          });
          wall.rightSide.mesh = new THREE.Group();
          checkCollision(wall);
        }
      }

      // Remove wall if too far
      if (wall.position.z > 20) {
        // Clean up the wall before removing
        if (wall.leftSide.mesh.parent) {
          wall.leftSide.mesh.parent.remove(wall.leftSide.mesh);
          wall.leftSide.mesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (child.geometry) child.geometry.dispose();
              if (Array.isArray(child.material)) {
                child.material.forEach((mat) => mat.dispose());
              } else if (child.material) {
                child.material.dispose();
              }
            }
          });
        }
        if (wall.rightSide.mesh.parent) {
          wall.rightSide.mesh.parent.remove(wall.rightSide.mesh);
          wall.rightSide.mesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (child.geometry) child.geometry.dispose();
              if (Array.isArray(child.material)) {
                child.material.forEach((mat) => mat.dispose());
              } else if (child.material) {
                child.material.dispose();
              }
            }
          });
        }
        walls.current.splice(i, 1);
        console.log('Wall removed at position', wall.position.z);
      }
    }
  });

  // Cleanup
  useEffect(() => {
    if (!isPlaying) {
      cleanupWalls();
    }
    return () => {
      cleanupWalls();
    };
  }, [isPlaying]);

  return (
    <>
      {walls.current.map((wall, index) => (
        <group key={index}>
          <primitive object={wall.leftSide.mesh} />
          <primitive object={wall.rightSide.mesh} />
        </group>
      ))}
    </>
  );
}
