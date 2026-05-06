import React, { useEffect, useCallback, useRef } from 'react';

export interface KeyboardControlProps {
  onKeyboardMove: (dx: number, dy: number) => void;
  onKeyboardEnd: () => void;
  speed: number;
}

type KeyState = {
  ArrowUp: boolean;
  ArrowDown: boolean;
  ArrowLeft: boolean;
  ArrowRight: boolean;
  KeyW: boolean;
  KeyS: boolean;
  KeyA: boolean;
  KeyD: boolean;
};
type ValidKey = keyof KeyState;

const KeyboardControl: React.FC<KeyboardControlProps> = ({
  onKeyboardMove,
  onKeyboardEnd,
  speed,
}) => {
  const keyStateRef = useRef<KeyState>({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    KeyW: false,
    KeyS: false,
    KeyA: false,
    KeyD: false,
  });

  const calculateMovement = useCallback(() => {
    const { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, KeyW, KeyS, KeyA, KeyD } =
      keyStateRef.current;

    let x = 0;
    let y = 0;

    if (ArrowLeft || KeyA) x -= speed;
    if (ArrowRight || KeyD) x += speed;

    if (ArrowUp || KeyW) y -= speed;
    if (ArrowDown || KeyS) y += speed;

    return { x, y };
  }, []);

  const updateMovement = useCallback(() => {
    const movement = calculateMovement();
    const { x, y } = movement;

    const anyKeyActive = Object.values(keyStateRef.current).some((isActive) => isActive);

    if (anyKeyActive) {
      if (onKeyboardMove) {
        onKeyboardMove(x, y);
      }
    } else {
      if (onKeyboardEnd) {
        onKeyboardEnd();
      }
    }
  }, [calculateMovement, onKeyboardMove, onKeyboardEnd]);

  const isValidKey = (key: string): key is ValidKey => {
    return key in keyStateRef.current;
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.code;

      if (isValidKey(key)) {
        event.preventDefault();

        if (!keyStateRef.current[key]) {
          keyStateRef.current[key] = true;
          updateMovement();
        }
      }
    },
    [updateMovement],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const key = event.code;

      if (keyStateRef.current.hasOwnProperty(key) && isValidKey(key)) {
        keyStateRef.current[key] = false;
        updateMovement();
      }
    },
    [updateMovement],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return <></>;
};

export default KeyboardControl;
