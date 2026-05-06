import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useCharacterStore } from '@/store/characterStore';
import { TimeManager } from '@/utils/core-utils/timer/time-manager';

// 🎮 Define controls map for movement
export const Controls = {
  left: 'left',
  right: 'right',
} as const;

// 🛠 Constants for movement and lanes
const MOVEMENT_SPEED = 1; // Increased speed for better responsiveness

export function CharacterControllerInner({
  boundaryLaneOffset,
  children,
  characterPosition,
  enableWireframe,
  joystickInputRef,
  keyboardInputRef,
}: {
  boundaryLaneOffset: number;
  children: React.ReactNode;
  characterPosition: React.RefObject<THREE.Vector3>;
  enableWireframe?: boolean;
  joystickInputRef: React.RefObject<{ dx: number; dy: number }>;
  keyboardInputRef: React.RefObject<{ dx: number; dy: number }>;
}) {
  const characterRef = useRef<THREE.Group>(null);

  // 🟢 Zustand state management (Global store)
  const { setBoundingBox, setCharacterPosition } = useCharacterStore();

  const currentLerpRef = useRef(0.5); // Start at center (0.5 = middle of -boundaryLaneOffset to +boundaryLaneOffset range)
  const currentLerpForwardRef = useRef(0.5); // Start at center (0.5 = middle of -boundaryForwardOffset to +boundaryForwardOffset range)

  useEffect(() => {
    const timeManager = TimeManager.getInstance();

    const unsubFixed = timeManager.fixedUpdate((dt) => {
      if (!characterRef.current || !characterPosition.current) return;

      if (joystickInputRef.current) {
        // Handle joystick input, ignoring joystick if keyboard is active
        if (!keyboardInputRef.current || (keyboardInputRef.current.dx === 0 && keyboardInputRef.current.dy === 0)) {
          currentLerpRef.current += joystickInputRef.current.dx * MOVEMENT_SPEED * dt;
          currentLerpForwardRef.current += joystickInputRef.current.dy * MOVEMENT_SPEED * dt;
        }
      }

      if (keyboardInputRef.current) {
        // Handle keyboard input from KeyboardControl, ignoring keyboard if joystick is active
        if (!joystickInputRef.current || (joystickInputRef.current.dx === 0 && joystickInputRef.current.dy === 0)) {
          currentLerpRef.current += keyboardInputRef.current.dx * dt;
          currentLerpForwardRef.current += keyboardInputRef.current.dy * dt;
        }
      }

      // 🚀 Calculate smooth movement to target lane
      currentLerpRef.current = Math.min(1, Math.max(0, currentLerpRef.current));
      characterPosition.current.x = THREE.MathUtils.lerp(-boundaryLaneOffset, boundaryLaneOffset, currentLerpRef.current);
      // Forward/backward movement (optional, can be adjusted or removed)
      currentLerpForwardRef.current = Math.min(1, Math.max(0, currentLerpForwardRef.current));
      characterPosition.current.z = THREE.MathUtils.lerp(10, 30, currentLerpForwardRef.current);

      // 🟢 Apply position to character mesh
      characterRef.current.position.copy(characterPosition.current);

      // 🟢 Update bounding box every frame (for collision detection)
      characterRef.current.updateMatrixWorld(true);
      const boundingBox = new THREE.Box3().setFromObject(characterRef.current);
      setBoundingBox(boundingBox);

      // 🔥 Debugging: Add BoxHelper for character (if not already added)
      // TODO: Optimize by only adding/removing when enableWireframe changes, or use core helper
      if (enableWireframe) {
        if (!characterRef.current.userData.helper) {
          const helper = new THREE.BoxHelper(characterRef.current, 0x0000ff);
          characterRef.current.userData.helper = helper;
          characterRef.current.parent?.add(helper);
        }
        characterRef.current.userData.helper.update();
      } else {
        // remove the helper if it exists.
        if (characterRef.current.userData.helper) {
          characterRef.current.parent?.remove(characterRef.current.userData.helper);
          characterRef.current.userData.helper.dispose(); // Clean up resources
          delete characterRef.current.userData.helper; // Remove the reference
        }
      }
      //

      setCharacterPosition(characterRef.current.position);
    });

    return () => {
      unsubFixed();
    };
  }, [
    characterPosition,
    setBoundingBox,
    setCharacterPosition,
    enableWireframe,
    joystickInputRef,
    keyboardInputRef,
  ]);

  return <group ref={characterRef}>{children}</group>;
}

export function CharacterController({
  boundaryLaneOffset,
  children,
  enableWireframe,
  joystickInputRef,
  keyboardInputRef,
}: {
  boundaryLaneOffset: number;
  children: React.ReactNode;
  enableWireframe?: boolean;
  joystickInputRef?: React.RefObject<{ dx: number; dy: number }>;
  keyboardInputRef?: React.RefObject<{ dx: number; dy: number }>;
}) {
  const characterPosition = useRef(new THREE.Vector3(0, 0, 20));

  // Create default refs if not provided
  const defaultJoystickRef = useRef({ dx: 0, dy: 0 });
  const defaultKeyboardRef = useRef({ dx: 0, dy: 0 });

  const activeJoystickRef = joystickInputRef || defaultJoystickRef;
  const activeKeyboardRef = keyboardInputRef || defaultKeyboardRef;

  return (
    <CharacterControllerInner
      boundaryLaneOffset={boundaryLaneOffset}
      enableWireframe={enableWireframe}
      characterPosition={characterPosition}
      joystickInputRef={activeJoystickRef}
      keyboardInputRef={activeKeyboardRef}
    >
      {children}
    </CharacterControllerInner>
  );
}
