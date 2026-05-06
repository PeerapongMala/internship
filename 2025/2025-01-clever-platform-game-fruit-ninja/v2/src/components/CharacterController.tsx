import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { KeyboardControls, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { useCharacterStore } from '@/store/characterStore';

// 🎮 Define controls map for movement
export const Controls = {
  left: 'left',
  right: 'right',
} as const;

// 🛠 Constants for movement and lanes
const LANE_WIDTH = 15; // Distance between lanes
const MOVEMENT_SPEED = 2; // Smoother speed

// 🔥 Character state (to track lane and shooting properties)
export const characterState = {
  targetLane: 0, // 0 = left, 1 = right
  burstCount: 1, // Number of projectiles per shot
  burstSpeed: 0, // Additional shooting speed
};

export function CharacterControllerInner({
  children,
  characterPosition,
}: {
  children: React.ReactNode;
  characterPosition: React.RefObject<THREE.Vector3>;
}) {
  const characterRef = useRef<THREE.Group>(null);

  // 🟢 Zustand state management (Global store)
  const { setBoundingBox, setCharacterPosition } = useCharacterStore();
  const [, getKeys] = useKeyboardControls(); // Listen for key inputs

  const currentLerpRef = useRef(0); // Keeps track of the intended lane

  useFrame((_state, delta) => {
    if (!characterRef.current || !characterPosition.current) return;

    const keys = getKeys();

    // Handle Movement
    if (keys.left) {
      currentLerpRef.current -= MOVEMENT_SPEED * delta;
    }

    if (keys.right) {
      currentLerpRef.current += MOVEMENT_SPEED * delta;
    }

    // 🚀 Calculate smooth movement to target lane
    currentLerpRef.current = Math.min(1, Math.max(0, currentLerpRef.current));
    characterPosition.current.x = THREE.MathUtils.lerp(-10, 10, currentLerpRef.current);

    // 🟢 Apply position to character mesh
    characterRef.current.position.x = characterPosition.current.x;

    // 🟢 Update bounding box every frame (for collision detection)
    characterRef.current.updateMatrixWorld(true);
    const boundingBox = new THREE.Box3().setFromObject(characterRef.current);
    setBoundingBox(boundingBox);

    // // 🔥 Debugging: Add BoxHelper for character (if not already added)
    // if (!characterRef.current.userData.helper) {
    //   const helper = new THREE.BoxHelper(characterRef.current, 0x0000ff);
    //   characterRef.current.userData.helper = helper;
    //   characterRef.current.parent?.add(helper);
    // }
    // characterRef.current.userData.helper.update();
    // //

    setCharacterPosition(characterRef.current.position);
  });

  return <group ref={characterRef}>{children}</group>;
}

export function CharacterController({ children }: { children: React.ReactNode }) {
  const characterPosition = useRef(new THREE.Vector3(-LANE_WIDTH / 2, 0, 0));

  return (
    <KeyboardControls
      map={[
        { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
        { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
      ]}
    >
      <CharacterControllerInner characterPosition={characterPosition}>
        {children}
        {/* 🟢 Pass accurate position for projectiles */}
        {/* <ProjectileHandler followPosition={characterPosition.current} /> */}
      </CharacterControllerInner>
    </KeyboardControls>
  );
}
