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
  leftSide: ObstacleSide;
  rightSide: ObstacleSide;
}

interface ObstacleHandlerProps {
  onPlayerCollision?: () => void;
}

export function ObstacleHandler({ }: ObstacleHandlerProps) {
  const obstacles = useRef<Obstacle[]>([]);
  const { isPlaying, score, setScore, pauseGame } = useGameStore();
  const { currentPlayer, addToLeaderboard } = useLeaderboardStore();
  const { boundingBox: characterBox } = useCharacterStore();
  const { projectiles, removeProjectile } = useProjectileStore();
  const { timeRemaining } = useTimerStore();
  const lastSpawnTime = useRef(0);
  const asteroidModel = useRef<THREE.Group | null>(null);

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

  const createObstacle = () => {
    if (!asteroidModel.current) {
      console.warn('⚠️ Asteroid model not loaded yet!');
      return null;
    }

    const leftGroup = new THREE.Group();
    const rightGroup = new THREE.Group();
    leftGroup.add(asteroidModel.current.clone());
    rightGroup.add(asteroidModel.current.clone());

    leftGroup.position.x = -OBSTACLE_CONFIG.LANE_GAP / 2;
    rightGroup.position.x = OBSTACLE_CONFIG.LANE_GAP / 2;

    const hp = Math.ceil(Math.random() * 3);

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

    const leftHPText = createHPText(hp);
    const rightHPText = createHPText(hp);

    leftGroup.add(leftHPText);
    rightGroup.add(rightHPText);

    const createBoundingBox = (mesh: THREE.Group) => new THREE.Box3().setFromObject(mesh);

    return {
      position: new THREE.Vector3(0, 0, OBSTACLE_CONFIG.SPAWN_DISTANCE),
      leftSide: {
        mesh: leftGroup,
        hp,
        hpTextMesh: leftHPText,
        boundingBox: createBoundingBox(leftGroup),
      },
      rightSide: {
        mesh: rightGroup,
        hp,
        hpTextMesh: rightHPText,
        boundingBox: createBoundingBox(rightGroup),
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

  useFrame((state) => {
    if (!isPlaying) return;

    const currentTime = Date.now();
    if (currentTime - lastSpawnTime.current > OBSTACLE_CONFIG.SPAWN_INTERVAL) {
      const obstacle = createObstacle();
      if (obstacle) {
        obstacle.position.set(0, 0, OBSTACLE_CONFIG.SPAWN_DISTANCE);
        obstacle.leftSide.mesh.position.set(
          -OBSTACLE_CONFIG.LANE_GAP / 2,
          0,
          OBSTACLE_CONFIG.SPAWN_DISTANCE,
        );
        obstacle.rightSide.mesh.position.set(
          OBSTACLE_CONFIG.LANE_GAP / 2,
          0,
          OBSTACLE_CONFIG.SPAWN_DISTANCE,
        );

        state.scene.add(obstacle.leftSide.mesh);
        state.scene.add(obstacle.rightSide.mesh);
        obstacles.current.push(obstacle);
        lastSpawnTime.current = currentTime;
      }
    }

    obstacles.current.forEach((obstacle) => {
      obstacle.position.z += OBSTACLE_CONFIG.SPEED;
      obstacle.leftSide.mesh.position.z = obstacle.position.z;
      obstacle.rightSide.mesh.position.z = obstacle.position.z;
      obstacle.leftSide.boundingBox.setFromObject(obstacle.leftSide.mesh);
      obstacle.rightSide.boundingBox.setFromObject(obstacle.rightSide.mesh);

      if (characterBox.intersectsBox(obstacle.leftSide.boundingBox)) {
        console.log('❌ Character hit left obstacle!');
        handleCollision();
      }

      if (characterBox.intersectsBox(obstacle.rightSide.boundingBox)) {
        console.log('❌ Character hit right obstacle!');
        handleCollision();
      }

      projectiles.forEach((projectile) => {
        const projectileBox = new THREE.Box3().setFromObject(projectile.mesh);

        if (projectileBox.intersectsBox(obstacle.leftSide.boundingBox)) {
          console.log('🔥 Projectile hit left obstacle!');
          obstacle.leftSide.hp -= 1;
          (obstacle.leftSide.hpTextMesh.material as THREE.MeshBasicMaterial).map =
            createTextTexture(obstacle.leftSide.hp.toString(), true);

          removeProjectile(projectile.id);
          if (obstacle.leftSide.hp <= 0) {
            state.scene.remove(obstacle.leftSide.mesh);
            obstacle.leftSide.mesh.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material))
                  child.material.forEach((mat) => mat.dispose());
                else child.material.dispose();
              }
            });
            obstacle.leftSide.mesh = new THREE.Group();
            setScore(score + 1);
          }
        }

        if (projectileBox.intersectsBox(obstacle.rightSide.boundingBox)) {
          console.log('🔥 Projectile hit right obstacle!');
          obstacle.rightSide.hp -= 1;
          (obstacle.rightSide.hpTextMesh.material as THREE.MeshBasicMaterial).map =
            createTextTexture(obstacle.rightSide.hp.toString(), true);

          removeProjectile(projectile.id);
          if (obstacle.rightSide.hp <= 0) {
            state.scene.remove(obstacle.rightSide.mesh);
            obstacle.rightSide.mesh.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material))
                  child.material.forEach((mat) => mat.dispose());
                else child.material.dispose();
              }
            });
            obstacle.rightSide.mesh = new THREE.Group();
            setScore(score + 1);
          }
        }
      });
    });

    obstacles.current = obstacles.current.filter(
      (obstacle) => obstacle.leftSide.hp > 0 || obstacle.rightSide.hp > 0,
    );
  });

  return null;
}
