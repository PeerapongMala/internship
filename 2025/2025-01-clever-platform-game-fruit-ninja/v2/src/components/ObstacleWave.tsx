import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { useGameStore } from '@/store/gameStore';
import { createTextTexture } from '@/utils/TextTextureUtility';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { useCharacterStore } from '@/store/characterStore';
import { useProjectileStore } from '@/store/projectileStore';
import { useTimerStore } from '@/store/timerStore';
import { SceneName } from '@/types/game';
import { SceneManager } from '@core-utils/scene/scene-manager';

interface ObstacleConfig {
  readonly WIDTH: number;
  readonly HEIGHT: number;
  readonly DEPTH: number;
  readonly SPEED: number;
  readonly SPAWN_DISTANCE: number;
  readonly LANE_WIDTH: number;
  readonly LANE_GAP: number;
  readonly FONT_SIZE: number;
  readonly SPAWN_INTERVAL: number;
}

const OBSTACLE_CONFIG: ObstacleConfig = {
  WIDTH: 8,
  HEIGHT: 8,
  DEPTH: 4,
  SPEED: 0.2,
  SPAWN_DISTANCE: -220,
  LANE_WIDTH: 15,
  LANE_GAP: 20,
  FONT_SIZE: 24,
  SPAWN_INTERVAL: 6000,
};

interface ObstacleSide {
  mesh: THREE.Group;
  hp: number;
  hpTextMesh: THREE.Mesh;
  boundingBox: THREE.Box3;
}

interface Obstacle {
  position: THREE.Vector3;
  entityData: ObstacleSide;
}

interface ObstacleHandlerProps {
  onPlayerCollision?: () => void;
  wave?: any[];
  onWaveComplete?: () => void;
}

export function ObstacleWave({ wave, onWaveComplete }: ObstacleHandlerProps) {
  const obstacles = useRef<any[]>([]);
  const { isPlaying, score, setScore, pauseGame } = useGameStore();
  const { currentPlayer, addToLeaderboard } = useLeaderboardStore();
  const { boundingBox: characterBox } = useCharacterStore();
  const { projectiles, removeProjectile } = useProjectileStore();
  const { timeRemaining } = useTimerStore();
  const lastSpawnTime = useRef(Date.now());
  const asteroidModel = useRef<THREE.Group | null>(null);
  const hasCompleted = useRef(false);

  useEffect(() => {
    const mtlLoader = new MTLLoader();
    mtlLoader.load('/Models/Asteriod/AsteriodTexture.mtl', (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load('/Models/Asteriod/AsteriodModel.obj', (object) => {
        object.scale.set(0.01, 0.01, 0.01);
        asteroidModel.current = object;
        console.log('🚀 Asteroid model loaded!');
      });
    });
  }, []);

  const createObstacle = (wave: any) => {
    if (!asteroidModel.current) {
      console.warn('⚠️ Asteroid model not loaded yet!');
      return null;
    }

    const newObstableGroup = new THREE.Group();
    newObstableGroup.add(asteroidModel.current.clone());
    newObstableGroup.position.x = OBSTACLE_CONFIG.LANE_GAP;

    const HP = 1 * wave.statMultiplier;

    const createHPText = (hpValue: number) => {
      const hpTexture = createTextTexture(hpValue.toString(), true, {
        font: {
          normal: `bold ${OBSTACLE_CONFIG.FONT_SIZE}px Arial`,
          wall: `bold ${OBSTACLE_CONFIG.FONT_SIZE}px Arial`,
        },
      });

      const hpMaterial = new THREE.MeshBasicMaterial({
        map: hpTexture,
        transparent: true,
      });

      const hpMesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), hpMaterial);
      hpMesh.position.set(0, 10, 5);
      return hpMesh;
    };

    const newHPText = createHPText(Number(HP));

    newObstableGroup.add(newHPText);

    const createBoundingBox = (mesh: THREE.Group) => new THREE.Box3().setFromObject(mesh);

    return {
      position: new THREE.Vector3(0, 0, OBSTACLE_CONFIG.SPAWN_DISTANCE),
      entityData: {
        mesh: newObstableGroup,
        hp: Number(HP),
        hpTextMesh: newHPText,
        boundingBox: createBoundingBox(newObstableGroup),
      },
    };
  };

  const handleCollision = () => {
    pauseGame();
    if (currentPlayer) {
      currentPlayer.score = score;
      currentPlayer.lastCountdownTime = timeRemaining;
      addToLeaderboard(currentPlayer);
    }
    SceneManager.getInstance().setScene(SceneName.SCORE);
  };

  const handleDisposeWall = (walldata: ObstacleSide) => {
    if (walldata.mesh.parent) {
      walldata.mesh.parent.remove(walldata.mesh);
      walldata.mesh.traverse((child) => {
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
  };

  const cleanObstacle = (wallIndex: number) => {
    const targetWall: Obstacle = obstacles.current[wallIndex];
    if (targetWall) {
      handleDisposeWall(targetWall.entityData);
      obstacles.current.splice(wallIndex, 1);
    }
  };

  useFrame((state) => {
    if (!isPlaying) return;
    if (!wave) return;
    const currentTime = Date.now();
    //console.log("wave data", wave);
    wave.forEach((element, index) => {
      if (currentTime - lastSpawnTime.current > element.distanceAt * 1000) {
        const obstacle = createObstacle(element);
        if (obstacle) {
          obstacle.position.set(0, 0, OBSTACLE_CONFIG.SPAWN_DISTANCE);

          obstacle.entityData.mesh.position.set(
            (Math.floor(Math.random() * 3 - 1) * OBSTACLE_CONFIG.LANE_GAP) / 2,
            0,
            OBSTACLE_CONFIG.SPAWN_DISTANCE,
          );

          state.scene.add(obstacle.entityData.mesh);
          obstacles.current.push(obstacle);
        }
        wave.splice(index, 1);
      }
    });

    obstacles.current.forEach((obstacle: Obstacle, index) => {
      obstacle.position.z += OBSTACLE_CONFIG.SPEED;
      obstacle.entityData.mesh.position.z = obstacle.position.z;
      obstacle.entityData.boundingBox.setFromObject(obstacle.entityData.mesh);

      if (characterBox.intersectsBox(obstacle.entityData.boundingBox)) {
        console.log('❌ Character hit left obstacle!');
        handleCollision();
      }

      projectiles.forEach((projectile) => {
        const projectileBox = new THREE.Box3().setFromObject(projectile.mesh);

        if (projectileBox.intersectsBox(obstacle.entityData.boundingBox)) {
          console.log('🔥 Projectile hit left obstacle!');
          obstacle.entityData.hp -= 1;
          (obstacle.entityData.hpTextMesh.material as THREE.MeshBasicMaterial).map =
            createTextTexture(obstacle.entityData.hp.toString(), true);

          removeProjectile(projectile.id);
          if (obstacle.entityData.hp <= 0) {
            state.scene.remove(obstacle.entityData.mesh);
            obstacle.entityData.mesh.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material))
                  child.material.forEach((mat) => mat.dispose());
                else child.material.dispose();
              }
            });
            obstacle.entityData.mesh = new THREE.Group();
            setScore(score + 1);
          }
        }

        if (obstacle.position.z > 20) {
          cleanObstacle(index);
        }
      });
    });

    if (
      wave &&
      wave.length <= 0 &&
      hasCompleted.current != true &&
      obstacles.current.length <= 0
    ) {
      hasCompleted.current = true;
      if (onWaveComplete) {
        onWaveComplete();
      }
    }
  });

  return (
    <>
      {obstacles.current.map((obstacle, index) => (
        <group key={index}>
          <primitive object={obstacle.entityData.mesh} />
        </group>
      ))}
    </>
  );
}
