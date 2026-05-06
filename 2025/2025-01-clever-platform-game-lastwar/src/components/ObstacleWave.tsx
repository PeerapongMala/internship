import { useRef, useEffect, useReducer } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { useGameStore } from '@/store/gameStore';
import { createTextTexture } from '@/utils/TextTextureUtility';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { useCharacterStore } from '@/store/characterStore';
import { useProjectileStore } from '@/store/projectileStore';
import { useTimerStore } from '@/store/timerStore';
import { ModelFileLoader } from '@core-utils/3d/model-file-loader';
import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import { ObstacleInfo } from './Wave';
import { TimeManager } from '@/utils/core-utils/timer/time-manager';
import { ModelConfig, OBSTACLE_MODELS as MODELS } from '@/config/modelAnimationConfig';
import { playSoundEffect } from '@core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

interface ObstacleConfig {
  // readonly WIDTH: number;
  // readonly HEIGHT: number;
  // readonly DEPTH: number;
  readonly SPEED: number;
  readonly SPAWN_DISTANCE: number;
  readonly FONT_SIZE: number;
  readonly TEXTURE_HEIGHT_OFFSET: number;
}

const OBSTACLE_CONFIG: ObstacleConfig = {
  // WIDTH: 8,
  // HEIGHT: 8,
  // DEPTH: 4,
  SPEED: 0.2,
  SPAWN_DISTANCE: -220,
  FONT_SIZE: 240,
  TEXTURE_HEIGHT_OFFSET: 15,
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
  lanes: number;
  laneWidth: number;
  wave?: ObstacleInfo[];
  waveIndex?: number;
  onPlayerCollision?: () => void;
  onObstacleDestroyed?: () => void;
  onWaveCompleted?: () => void;
}

export function ObstacleWave({
  lanes,
  laneWidth,
  wave,
  waveIndex,
  onPlayerCollision,
  onObstacleDestroyed,
  onWaveCompleted,
}: ObstacleHandlerProps) {
  const obstacles = useRef<any[]>([]);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const { score } = useGameStore();
  const { currentPlayer, addToLeaderboard } = useLeaderboardStore();
  const { boundingBox: characterBox } = useCharacterStore();
  const { elapsedTime } = useTimerStore();
  const gameStartTime = useRef(Date.now());
  const asteroidModel = useRef<THREE.Group | THREE.Object3D | null>(null);
  const hasCompleted = useRef(false);
  const { scene, clock } = useThree(); // Get scene and clock from React Three Fiber
  const sceneRef = useRef<THREE.Scene>(scene);
  const clockRef = useRef<THREE.Clock>(clock);

  // Update refs when scene/clock changes
  useEffect(() => {
    sceneRef.current = scene;
    clockRef.current = clock;
  }, [scene, clock]);

  // Reset game start time when game starts
  useEffect(() => {
    const timeManager = TimeManager.getInstance();
    if (timeManager.isPlaying()) {
      gameStartTime.current = Date.now();
    }
  }, []);

  const BOUNDARY_LANE_OFFSET = (laneWidth * (lanes - 1)) / 2;

  // const MODEL_PATH = '/model/obstacle/animal-model/Zebra.fbx';
  // const ANIMATION_PATH = '/model/obstacle/Animal_Animation.fbx';

  const ANIMATION_PATH_TYPE_A = PUBLIC_ASSETS_LOCATION.model.obstacle.animalAnimation_typeA;
  const ANIMATION_PATH_TYPE_B = PUBLIC_ASSETS_LOCATION.model.obstacle.animalAnimation_typeB;

  // interface ModelAnimationData { model: string; animation: string };

  // const MODELS: ModelAnimationData[] = [
  //   {
  //     model: PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Elephant,
  //     animation: ANIMATION_PATH_TYPE_A
  //   },
  //   {
  //     model: PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Hippo,
  //     animation: ANIMATION_PATH_TYPE_A
  //   },
  //   {
  //     model: PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Bear,
  //     animation: ANIMATION_PATH_TYPE_A
  //   },
  //   {
  //     model: PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Deer,
  //     animation: ANIMATION_PATH_TYPE_B
  //   },
  //   {
  //     model: PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Giraffe,
  //     animation: ANIMATION_PATH_TYPE_B
  //   },
  //   {
  //     model: PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Zebra,
  //     animation: ANIMATION_PATH_TYPE_B
  //   },
  // ];

  //* สุ่ม model และ animation จาก MODELS array สำหรับแต่ละ obstacle
  const getRandomModel = () => {
    const randomIndex = Math.floor(Math.random() * MODELS.length);
    const selected = MODELS[randomIndex];
    console.log(`🎲 Selected random model for new obstacle:`, {
      index: randomIndex,
      model: selected.modelPath,
      animation: selected.animationPath
    });
    return selected;
  };

  // //* Preload animation models to prevent loading delays
  // const animationModelTypeA = useMemo(() => useFBX(ANIMATION_PATH_TYPE_A), []);
  // const animationModelTypeB = useMemo(() => useFBX(ANIMATION_PATH_TYPE_B), []);

  // //* Debug animation models
  // useEffect(() => {
  //   if (animationModelTypeA) {
  //     console.log('🎬 Animation model Type A loaded:', {
  //       animationCount: animationModelTypeA.animations?.length || 0,
  //       animationNames: animationModelTypeA.animations?.map((clip: any) => clip.name) || []
  //     });
  //   }
  // }, [animationModelTypeA]);

  // useEffect(() => {
  //   if (animationModelTypeB) {
  //     console.log('🎬 Animation model Type B loaded:', {
  //       animationCount: animationModelTypeB.animations?.length || 0,
  //       animationNames: animationModelTypeB.animations?.map((clip: any) => clip.name) || []
  //     });
  //   }
  // }, [animationModelTypeB]);

  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  const animationModelTypeA = useRef<THREE.Group>(null);
  const animationModelTypeB = useRef<THREE.Group>(null);

  useEffect(() => {
    handleAnimationLoad(ANIMATION_PATH_TYPE_A, (animationFbx) => {
      animationModelTypeA.current = animationFbx;
      console.log('🎬 animation model Type A Loaded');
    });
    handleAnimationLoad(ANIMATION_PATH_TYPE_B, (animationFbx) => {
      animationModelTypeB.current = animationFbx;
      console.log('🎬 animation model Type B Loaded');
    });

    //* Load a sample model for reference with new features
    const sampleModel = MODELS[0]; // Use first model as sample
    ModelFileLoader({
      src: sampleModel.modelPath,
      scale: 1,
      rotation: [0, 0, 0], // No rotation for sample
      anchorPoint: 'bottom-center', // Place bottom of model on ground
      debugEnabled: true,
      onLoadComplete: (obj) => {
        asteroidModel.current = obj;
        console.log('🚀 Sample model loaded via ModelFileLoader with bottom anchor!');
      }
    });
  }, []);

  const handleAnimationLoad = (animationPath: string, onAnimationLoaded: (animationFbx: THREE.Group) => void) => {
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      animationPath,
      (animationFbx: THREE.Group) => {
        console.log(`FBX Animation loaded (${animationPath}):`);
        //* Animation clips
        onAnimationLoaded(animationFbx);
        return animationFbx;
      },
      undefined,
      (error: unknown) => {
        console.error('❌ FBX animation loading error:', error);
      }
    );
  }

  const handleAnimationMix = (modelFbx: THREE.Group, parentGroup: THREE.Group, randomModel: ModelConfig) => {

    console.log(`🦓 FBX Model loaded (${randomModel.modelPath}):`, {
      type: modelFbx.type,
      hasAnimations: !!modelFbx.animations,
      animationCount: modelFbx.animations?.length || 0,
      animationNames: modelFbx.animations?.map((clip: any) => clip.name) || []
    });

    // //* Apply rotation to the model (not to the skeleton)
    // const rotation: [number, number, number] = randomModel.animation === ANIMATION_PATH_TYPE_A
    //   ? [90, 0, -90]
    //   : [90, 180, -90];
    // modelFbx.rotation.set(
    //   THREE.MathUtils.degToRad(rotation[0]),
    //   THREE.MathUtils.degToRad(rotation[1]),
    //   THREE.MathUtils.degToRad(rotation[2])
    // );

    //* Scale down
    modelFbx.scale.setScalar(0.5);

    //* Add to parent group
    parentGroup.add(modelFbx);
    // const helper = new THREE.BoxHelper(modelFbx, 0x0000ff);
    // parentGroup.add(helper);
    // helper.update();

    //* Loaded animation
    const animationFbx = (randomModel.animationPath === ANIMATION_PATH_TYPE_A)
      ? animationModelTypeA.current?.clone()
      : animationModelTypeB.current?.clone();

    //* Get animation clips
    const modelEmbeddedClips = modelFbx.animations || [];
    const externalAnimationClips = animationFbx?.animations || [];

    //* Strategy: Prefer embedded animation in model (most compatible), fallback to external
    let walkClip = modelEmbeddedClips.find((clip: any) =>
      clip.name.toLowerCase().includes('walk')
    ) || modelEmbeddedClips[0]; // Try embedded first

    let animationSource = 'embedded';

    if (!walkClip && externalAnimationClips.length > 0) {
      walkClip = externalAnimationClips.find((clip: any) =>
        clip.name.toLowerCase().includes('walk')
      ) || externalAnimationClips[0];
      animationSource = 'external';
    }

    if (walkClip) {
      //* Setup animation mixer
      try {
        const localMixer = new THREE.AnimationMixer(modelFbx);
        const action = localMixer.clipAction(walkClip);
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();

        //* Store mixer in parent group for update loop
        (parentGroup as any).mixer = localMixer;

        console.log(`✅ Walk animation playing for ${randomModel.modelPath}:`, {
          clipName: walkClip.name,
          duration: walkClip.duration,
          source: animationSource,
          modelHasEmbedded: modelEmbeddedClips.length > 0,
          externalAvailable: externalAnimationClips.length > 0
        });
      } catch (error) {
        console.error('❌ Error applying animation:', error);
      }
    } else {
      console.warn('⚠️ No animation clips found for', randomModel.modelPath);
    }
  };

  const newTargetModelWithFBX = (parentGroup: THREE.Group) => {
    //* สุ่มโมเดลใหม่สำหรับ obstacle แต่ละตัว
    const randomModel = getRandomModel();

    //* Use FBXLoader directly like ModelAnimationTester to avoid rotation issues
    const fbxLoader = new FBXLoader();

    //* Load model
    fbxLoader.load(
      randomModel.modelPath,
      (modelFbx: THREE.Group) => handleAnimationMix(modelFbx, parentGroup, randomModel),
      undefined,
      (error: unknown) => {
        console.error('❌ FBX model loading error:', error);
      }
    );
  };

  const createObstacle = (wave: any) => {
    if (!asteroidModel.current) {
      console.warn('⚠️ Asteroid model not loaded yet!');
      return null;
    }

    const newObstableGroup = new THREE.Group();
    // Load model and setup animation
    newTargetModelWithFBX(newObstableGroup);

    const HP = 1 * wave.statMultiplier;

    const createHPText = (hpValue: number) => {
      const hpTexture = createTextTexture(hpValue.toString(), {
        size: 1024, // เพิ่มจาก 512 → 1024
        font: {
          normal: `bold ${OBSTACLE_CONFIG.FONT_SIZE}px Arial`,
          wall: `bold ${OBSTACLE_CONFIG.FONT_SIZE}px Arial`,
        },
        strokeWidth: 6, // ความหนาของขอบสำหรับ obstacle
      });

      const hpMaterial = new THREE.MeshBasicMaterial({
        map: hpTexture,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide, // แสดงทั้งสองด้าน
      });

      const hpMesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), hpMaterial); // เพิ่มจาก 15x15 → 20x20
      hpMesh.position.set(0, OBSTACLE_CONFIG.TEXTURE_HEIGHT_OFFSET, 0); // วางให้อยู่เหนือตัว obstacle
      hpMesh.renderOrder = 999; // render ทับสุด

      // ทำให้ billboard (หันหน้าตามกล้องเสมอ)
      hpMesh.onBeforeRender = function (_renderer, _scene, camera) {
        this.quaternion.copy(camera.quaternion);
      };

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
    TimeManager.getInstance().pause();
    void playSoundEffect(SOUND_GROUPS.sfx.endgame);
    if (currentPlayer) {
      currentPlayer.score = score;
      currentPlayer.lastCountdownTime = elapsedTime; // เวลาที่เล่นไป
      addToLeaderboard(currentPlayer);
    }
    // Call onPlayerCollision to notify game over
    if (onPlayerCollision) {
      onPlayerCollision();
    }
  };

  const handleDisposeWall = (walldata: ObstacleSide) => {
    if (walldata.mesh.parent) {
      walldata.mesh.parent.remove(walldata.mesh);

      //* Clean up mixer if exists
      const mixer = (walldata.mesh as any).mixer;
      if (mixer) {
        mixer.stopAllAction();
        mixer.uncacheRoot(mixer.getRoot());
      }

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
      forceUpdate(); // Trigger re-render
    }
  };

  // Reset hasCompleted when wave data changes (new wave loaded)
  useEffect(() => {
    if (waveIndex !== undefined && hasCompleted.current === true) {
      console.log(`🔄 ObstacleWave: New wave ${waveIndex} detected, resetting hasCompleted flag`);
      hasCompleted.current = false;
    }
    // Reset game start time for new wave
    if (waveIndex !== undefined) {
      gameStartTime.current = Date.now();
      console.log(`⏱️ ObstacleWave: Reset gameStartTime for wave ${waveIndex}`);
    }
  }, [waveIndex]);

  useEffect(() => {
    if (!wave) return;

    const timeManager = TimeManager.getInstance();

    const unsubUpdate = timeManager.update((delta) => {
      // Only update if game is playing
      if (!timeManager.isPlaying()) return;

      //* Update main mixer if exists
      mixerRef.current?.update(delta);

      //* Update individual mixers for each obstacle
      let activeCount = 0;
      obstacles.current.forEach((obstacle) => {
        const mixer = (obstacle.entityData.mesh as any).mixer;
        if (mixer) {
          mixer.update(delta);
          activeCount++;
        }
      });

      //* Log active mixers occasionally for debugging (every ~2 seconds)
      if (Math.floor(clockRef.current.elapsedTime) % 2 === 0 && clockRef.current.elapsedTime % 1 < delta && activeCount > 0) {
        console.log(`🎬 Updating ${activeCount} active animation mixers`);
      }

      const currentTime = Date.now();
      const elapsedTime = (currentTime - gameStartTime.current) / 1000; // seconds since game start

      // Spawn obstacles - iterate backwards to safely splice
      for (let i = wave.length - 1; i >= 0; i--) {
        const element = wave[i];
        // Check if enough time has passed since game start
        if (elapsedTime >= element.distanceAt) {
          const obstacle = createObstacle(element);
          if (obstacle) {
            // Use configured lane if provided (0-2), otherwise random. -1 or undefined = random
            const targetLane = element.lane !== undefined && element.lane >= 0
              ? element.lane
              : Math.round(Math.random() * (lanes - 1));
            const laneCenterPosition = (targetLane * laneWidth) - BOUNDARY_LANE_OFFSET;

            //* Set both obstacle position and mesh position to the same lane and spawn distance
            obstacle.position.set(laneCenterPosition, 0, OBSTACLE_CONFIG.SPAWN_DISTANCE);
            obstacle.entityData.mesh.position.copy(obstacle.position);

            sceneRef.current.add(obstacle.entityData.mesh);
            obstacles.current.push(obstacle);
            forceUpdate(); // Trigger re-render when obstacle spawns
            console.log(`✅ Obstacle spawned at ${elapsedTime.toFixed(2)}s (distanceAt: ${element.distanceAt}s)`);
          }
          wave.splice(i, 1);
        }
      }

      // Update obstacles - iterate backwards to safely splice
      for (let i = obstacles.current.length - 1; i >= 0; i--) {
        const obstacle = obstacles.current[i];

        obstacle.position.z += OBSTACLE_CONFIG.SPEED;
        obstacle.entityData.mesh.position.z = obstacle.position.z;
        obstacle.entityData.boundingBox.setFromObject(obstacle.entityData.mesh);

        if (characterBox.intersectsBox(obstacle.entityData.boundingBox)) {
          console.log('❌ Character hit left obstacle!');
          handleCollision();
          continue; // Skip to next iteration after collision
        }

        // Get latest projectiles from store inside the update loop
        const currentProjectiles = useProjectileStore.getState().projectiles;

        let obstacleDestroyed = false;
        currentProjectiles.forEach((projectile) => {
          if (obstacleDestroyed) return; // Skip if already destroyed

          const projectileBox = new THREE.Box3().setFromObject(projectile.mesh);

          if (projectileBox.intersectsBox(obstacle.entityData.boundingBox)) {
            console.log('🔥 Projectile hit left obstacle!');
            obstacle.entityData.hp -= 1;
            (obstacle.entityData.hpTextMesh.material as THREE.MeshBasicMaterial).map =
              createTextTexture(obstacle.entityData.hp.toString(), {
                size: 1024,
                font: {
                  normal: `bold ${OBSTACLE_CONFIG.FONT_SIZE}px Arial`,
                  wall: `bold ${OBSTACLE_CONFIG.FONT_SIZE}px Arial`,
                },
                strokeWidth: 6,
              });

            useProjectileStore.getState().removeProjectile(projectile.id);
            if (obstacle.entityData.hp <= 0) {
              console.log('💥 Obstacle destroyed! Cleaning up...');
              void playSoundEffect(SOUND_GROUPS.sfx.star);
              handleDisposeWall(obstacle.entityData);
              cleanObstacle(i);
              if (onObstacleDestroyed) onObstacleDestroyed();
              obstacleDestroyed = true;
            }
          }
        });

        if (obstacleDestroyed) continue; // Skip position check if destroyed

        // เคลื่อนที่พ้นมุมกล้อง
        // Clean up obstacles that have passed the player
        if (obstacle.position.z > 40) {
          console.log(`🗑️ Obstacle passed player (z: ${obstacle.position.z}), removing. Remaining: ${obstacles.current.length - 1}`);
          cleanObstacle(i);
        }
      }

      if (
        wave &&
        wave.length <= 0 &&
        hasCompleted.current != true &&
        obstacles.current.length <= 0
      ) {
        hasCompleted.current = true;
        console.log('🏁 ObstacleWave: All obstacles passed, sending wave complete', {
          spawnListEmpty: wave.length <= 0,
          obstaclesEmpty: obstacles.current.length <= 0
        });
        if (onWaveCompleted) {
          onWaveCompleted();
        }
      }
    });

    return () => {
      unsubUpdate();
    };
  }, [characterBox, onObstacleDestroyed, onWaveCompleted]); // Remove 'wave' from deps - we mutate it directly with splice

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
