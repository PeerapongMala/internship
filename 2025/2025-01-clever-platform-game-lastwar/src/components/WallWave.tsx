import { useRef, useEffect, useReducer } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createTextTexture } from '@/utils/TextTextureUtility';
import { useCharacterStore } from '@/store/characterStore';
import type { WallInfo } from './Wave';
import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import { TimeManager } from '@/utils/core-utils/timer/time-manager';
import { playSoundEffect } from '@core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

interface WallConfig {
  readonly WIDTH: number;
  readonly HEIGHT: number;
  readonly DEPTH: number;
  readonly SPEED: number;
  readonly SPAWN_DISTANCE: number;
  readonly FONT_SIZE: number;
  readonly LARGE_FONT_SIZE: number;
  readonly TEXTURE_HEIGHT_OFFSET: number;
  // readonly SPAWN_INTERVAL: number;
}

const WALL_CONFIG: WallConfig = {
  WIDTH: 30,
  HEIGHT: 30,
  DEPTH: 0.2,
  SPEED: 0.2,
  SPAWN_DISTANCE: -220,
  FONT_SIZE: 140, // ขนาดฟอนต์บรรทัดแรก (ไอคอน + คำอธิบาย)
  LARGE_FONT_SIZE: 280, // ขนาดฟอนต์บรรทัดที่สอง (ตัวเลข) - ใหญ่กว่า 2 เท่า
  TEXTURE_HEIGHT_OFFSET: -8,
  // SPAWN_INTERVAL: 6000,
};

export interface WallEffect {
  type: 'hp' | 'burst' | 'burstSpeed';
  value: number;
  displayText: string;
}

interface WallEntity {
  effect: WallEffect;
  mesh: THREE.Group;
  lastCollisionTime?: number;
  hp: number;
  boundingBox: THREE.Box3;
}

interface Wall {
  position: THREE.Vector3;
  entityData: WallEntity;
}

const WALL_EFFECTS = {
  BURST: { type: 'burst' as const, value: 1, displayText: '🔫 burst\n+1' },
  BURST_SPEED: {
    type: 'burstSpeed' as const,
    value: 0.5,
    displayText: '⚡ fire rate\n+0.5',
  },
} as const;

interface WallProps {
  lanes: number;
  laneWidth: number;
  enableWireframe?: boolean;
  speed?: number;
  onCollision?: (effect: WallEffect) => void;
  wave?: WallInfo[];
  waveIndex?: number;
  onWaveCompleted?: () => void;
}

export function WallWave({
  lanes,
  laneWidth,
  enableWireframe,
  onCollision,
  wave,
  waveIndex,
  onWaveCompleted,
}: WallProps) {
  const walls = useRef<any[]>([]);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const gameStartTime = useRef(0);
  const { boundingBox: characterBox } = useCharacterStore();
  const hasCompleted = useRef(false);
  const { scene } = useThree(); // Get scene from React Three Fiber
  const sceneRef = useRef<THREE.Scene>(scene);

  // Update sceneRef when scene changes
  useEffect(() => {
    sceneRef.current = scene;
  }, [scene]);

  const BOUNDARY_LANE_OFFSET = (laneWidth * (lanes - 1)) / 2;

  useEffect(() => {
    const timeManager = TimeManager.getInstance();
    if (timeManager.isPlaying()) {
      gameStartTime.current = Date.now();
    }
  }, []);

  const createWallEntity = (
    // isLeft: boolean,
    position: THREE.Vector3,
    effect: WallEffect,
  ) => {
    const group = new THREE.Group();

    // Create barrier mesh
    const barrierGeometry = new THREE.BoxGeometry(
      WALL_CONFIG.WIDTH,
      WALL_CONFIG.HEIGHT,
      WALL_CONFIG.DEPTH,
    );

    const textureLoader = new THREE.TextureLoader();
    const barrierTexture = effect.value > 0 ?
      textureLoader.load(
        PUBLIC_ASSETS_LOCATION.image.texture.wall.green
      ) :
      textureLoader.load(
        PUBLIC_ASSETS_LOCATION.image.texture.wall.red
      );

    const barrierMaterial = new THREE.MeshPhongMaterial({
      map: barrierTexture,
      transparent: true,
      opacity: 0.6,
    });

    const barrierMesh = new THREE.Mesh(barrierGeometry, barrierMaterial);

    // Position the barrier
    // const xOffset = isLeft ? -WALL_CONFIG.LANE_WIDTH / 2 : WALL_CONFIG.LANE_WIDTH / 2;
    // barrierMesh.position.set(xOffset, 0, 0);
    barrierMesh.position.set(0, 0, 0);

    // Create text mesh as separate plane (billboard style like ObstacleWave)
    const textPlaneGeometry = new THREE.PlaneGeometry(40, 20); // เพิ่มจาก 30x12 → 40x20

    const textTexture = createTextTexture(effect.displayText, {
      size: 1024, // เพิ่มจาก 512 → 1024
      font: {
        normal: `bold ${WALL_CONFIG.FONT_SIZE}px Arial`,
        wall: `bold ${WALL_CONFIG.FONT_SIZE}px Arial`,
      },
      lineFontSizes: [WALL_CONFIG.FONT_SIZE, WALL_CONFIG.LARGE_FONT_SIZE], // [บรรทัดแรก, บรรทัดที่สอง]
      strokeWidth: 8, // ความหนาของขอบสำหรับ wall
    });

    const textMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const textMesh = new THREE.Mesh(textPlaneGeometry, textMaterial);
    // วาง text ให้อยู่เหนือ wall และไม่ถูกตัดโดยกรอบ wall
    textMesh.position.set(0, WALL_CONFIG.HEIGHT / 2 + WALL_CONFIG.TEXTURE_HEIGHT_OFFSET, WALL_CONFIG.DEPTH + 1);
    textMesh.renderOrder = 999; // render ทับสุด

    // // ทำให้ billboard (หันหน้าตามกล้องเสมอ)
    // textMesh.onBeforeRender = function (_renderer, _scene, camera) {
    //   this.quaternion.copy(camera.quaternion);
    // };

    group.add(barrierMesh);
    group.add(textMesh);
    group.position.copy(position);

    if (enableWireframe) {
      // Create BoxHelper that matches the actual wall dimensions
      const helperGeometry = new THREE.BoxGeometry(
        WALL_CONFIG.WIDTH,
        WALL_CONFIG.HEIGHT,
        WALL_CONFIG.DEPTH
      );
      const helperEdges = new THREE.EdgesGeometry(helperGeometry);
      const helperLine = new THREE.LineSegments(
        helperEdges,
        new THREE.LineBasicMaterial({ color: 0x0000ff })
      );
      helperLine.position.set(0, 0, 0);
      group.add(helperLine);
      helperGeometry.dispose();
    }

    const createBoundingBox = (mesh: THREE.Group) => {
      const HitboxBox = new THREE.Box3();
      HitboxBox.setFromObject(mesh);
      HitboxBox.expandByVector(new THREE.Vector3(1, 1, 1));
      return HitboxBox;
    };

    return {
      effect,
      mesh: group,
      lastCollisionTime: 0,
      hp: 1,
      boundingBox: createBoundingBox(group),
    };
  };

  const handleDisposeWall = (walldata: WallEntity) => {
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

  const createWall = (waveObject: WallInfo) => {
    // const position = new THREE.Vector3(
    //   0,
    //   WALL_CONFIG.HEIGHT / 2,
    //   WALL_CONFIG.SPAWN_DISTANCE,
    // );
    const position = new THREE.Vector3(0, 0, WALL_CONFIG.SPAWN_DISTANCE);

    const effect: WallEffect = waveObject?.effect
      ? {
        type: waveObject.effect,
        value: parseFloat(waveObject.value ?? '0'),
        displayText: waveObject.effect === 'burstSpeed'
          ? `⚡ ความเร็ว\n${parseFloat(waveObject.value ?? '0') > 0 ? '+' : ''}${waveObject.value}`
          : waveObject.effect === 'burst'
            ? `🍊 ปริมาณ\n${parseFloat(waveObject.value ?? '0') > 0 ? '+' : ''}${waveObject.value}`
            : `❤️ hp\n${parseFloat(waveObject.value ?? '0') > 0 ? '+' : ''}${waveObject.value}`,
      }
      : WALL_EFFECTS.BURST;

    // const newEntity = createWallSide(true, position, leftEffect);
    const newEntity = createWallEntity(position, effect);

    const newWall: Wall = {
      position,
      entityData: newEntity,
    };

    const targetLane = waveObject.lane && waveObject.lane >= 0 ? waveObject.lane : Math.round(Math.random() * (lanes - 1));
    const laneCenterPosition = (targetLane * laneWidth) - BOUNDARY_LANE_OFFSET;

    //* Set both object position and mesh position to the same lane and spawn distance
    newWall.position.set(laneCenterPosition, 0, WALL_CONFIG.SPAWN_DISTANCE);
    newWall.entityData.mesh.position.copy(newWall.position);

    return newWall;
  };

  const cleanWall = (wallIndex: number) => {
    const targetWall: Wall = walls.current[wallIndex];
    if (targetWall) {
      handleDisposeWall(targetWall.entityData);
      walls.current.splice(wallIndex, 1);
      forceUpdate(); // Trigger re-render
    }
  };

  const handleCollision = (effect: WallEffect) => {
    const isPositive = effect.value > 0;
    playSoundEffect(isPositive ? SOUND_GROUPS.sfx.upgrade : SOUND_GROUPS.sfx.downgrade);

    if (onCollision) {
      onCollision(effect);
    }
  };

  // Reset hasCompleted when wave data changes (new wave loaded)
  useEffect(() => {
    if (waveIndex !== undefined && hasCompleted.current === true) {
      console.log(`🔄 WallWave: New wave ${waveIndex} detected, resetting hasCompleted flag`);
      hasCompleted.current = false;
    }
    // Reset game start time for new wave
    if (waveIndex !== undefined) {
      gameStartTime.current = Date.now();
      console.log(`⏱️ WallWave: Reset gameStartTime for wave ${waveIndex}`);
    }
  }, [waveIndex]);

  useEffect(() => {
    if (!wave) return;

    const timeManager = TimeManager.getInstance();

    const unsubUpdate = timeManager.update(() => {
      // Only update if game is playing
      if (!timeManager.isPlaying()) return;

      const currentTime = Date.now();
      const elapsedTime = (currentTime - gameStartTime.current) / 1000; // seconds since game start

      // Spawn walls - iterate backwards to safely splice
      for (let i = wave.length - 1; i >= 0; i--) {
        const element = wave[i];
        // Check if enough time has passed since game start
        if (elapsedTime >= element.distanceAt) {
          const newWall = createWall(element);

          if (newWall) {
            sceneRef.current.add(newWall.entityData.mesh);
            walls.current.push(newWall);
            console.log(`🔄 Calling forceUpdate, wallCount before: ${walls.current.length - 1}, after: ${walls.current.length}`);
            forceUpdate(); // Trigger re-render when wall spawns
            console.log(`✅ Wall spawned at ${elapsedTime.toFixed(2)}s (distanceAt: ${element.distanceAt}s)`, {
              wallCount: walls.current.length,
              position: newWall.position,
              meshPosition: newWall.entityData.mesh.position,
              hasParent: !!newWall.entityData.mesh.parent,
              parentName: newWall.entityData.mesh.parent?.type
            });
          } else {
            console.warn('⚠️ Wall creation failed');
          }

          wave.splice(i, 1);
        }
      }

      // Update walls - iterate backwards to safely splice
      for (let i = walls.current.length - 1; i >= 0; i--) {
        const wall = walls.current[i];

        wall.position.z += WALL_CONFIG.SPEED;
        wall.entityData.mesh.position.z = wall.position.z;
        wall.entityData.boundingBox.setFromObject(wall.entityData.mesh);

        if (
          characterBox.intersectsBox(wall.entityData.boundingBox) &&
          wall.entityData.mesh.parent
        ) {
          console.log('💥 Wall collision detected, removing wall');
          handleCollision(wall.entityData.effect);
          cleanWall(i); // Clean wall from array after collision
          continue; // Skip to next iteration
        }

        // Remove wall if too far
        // เคลื่อนที่พ้นมุมกล้อง
        if (wall.position.z > 20) {
          console.log(`🗑️ Wall passed player (z: ${wall.position.z}), removing`);
          cleanWall(i);
        }
      }

      if (
        wave &&
        wave.length <= 0 &&
        hasCompleted.current != true &&
        walls.current.length <= 0
      ) {
        hasCompleted.current = true;
        console.log('🏁 WallWave: All walls passed, sending wave complete', {
          spawnListEmpty: wave.length <= 0,
          wallsEmpty: walls.current.length <= 0
        });
        if (onWaveCompleted) {
          onWaveCompleted();
        }
      }
    });

    return () => {
      unsubUpdate();
    };
  }, [characterBox, onWaveCompleted, onCollision]); // Remove 'wave' from deps - we mutate it directly with splice

  // console.log('🎨 WallWave render:', { wallCount: walls.current.length, walls: walls.current });

  return (
    <>
      {walls.current.map((wall, index) => (
        <group key={index}>
          <primitive object={wall.entityData.mesh} />
        </group>
      ))}

      {/* //TODO: remove this code. for testing only*/}
      {/* {mesh.map((mesh) => (
        <group>
          <primitive object={mesh} />
        </group>
      ))} */}
    </>
  );
}
