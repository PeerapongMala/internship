import React, { useState, useEffect, useCallback, useRef } from 'react';
import './JoystickControl.css';

const maxDistance = 75;
const initialJoyStickX = 175;
const initialJoystickY = window.innerHeight - 175;

export interface JoystickControlProps {
  onJoystickMove: (dx: number, dy: number) => void;
  onJoystickEnd: () => void;
  disabled?: boolean;
}

const JoystickControl: React.FC<JoystickControlProps> = ({
  onJoystickMove,
  onJoystickEnd,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [visualX, setVisualX] = useState(0);
  const [visualY, setVisualY] = useState(0);
  const [joystickCenterX, setJoystickCenterX] = useState(initialJoyStickX);
  const [joystickCenterY, setJoystickCenterY] = useState(initialJoystickY);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);

    setStartX(clientX);
    setStartY(clientY);
    setJoystickCenterX(clientX);
    setJoystickCenterY(clientY);
    setVisualX(0);
    setVisualY(0);
  }, []);

  const handleMouseDown = (event: ReactMouseEvent) => {
    if (containerRef.current?.contains(event.target as Node)) {
      handleStart(event.clientX, event.clientY);
    }
  };

  const handleTouchStart = (event: ReactTouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    if (containerRef.current?.contains(event.target as Node)) {
      handleStart(touch.clientX, touch.clientY);
    }
  };

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setVisualX(0);
    setVisualY(0);
    setJoystickCenterX(initialJoyStickX);
    setJoystickCenterY(initialJoystickY);
    if (onJoystickEnd) {
      onJoystickEnd();
    }
  }, [onJoystickEnd]);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (isDragging) {
        const dx = clientX - startX;
        const dy = clientY - startY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        let visualDx = dx;
        let visualDy = dy;

        if (distance > maxDistance) {
          const ratio = maxDistance / distance;
          visualDx = dx * ratio;
          visualDy = dy * ratio;
        }
        setVisualX(visualDx);
        setVisualY(visualDy);

        const xSpeedMultiplier = dx / distance;
        const ySpeedMultiplier = dy / distance;
        if (onJoystickMove) {
          onJoystickMove(xSpeedMultiplier, ySpeedMultiplier);
        }
      }
    },
    [isDragging, startX, startY, onJoystickMove],
  );

  useEffect(() => {
    const handleInitialInteraction = (event: MouseEvent | TouchEvent) => {
      // Skip if joystick is disabled (e.g., during countdown/pause)
      if (disabled) return;

      let clientX,
        clientY = 0;

      if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
      } else if (event instanceof TouchEvent && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      }

      if (clientX && clientY) {
        handleStart(clientX, clientY);
      }
    };

    document.addEventListener('mousedown', handleInitialInteraction);
    document.addEventListener('touchstart', handleInitialInteraction, { passive: false });

    return () => {
      document.removeEventListener('mousedown', handleInitialInteraction);
      document.removeEventListener('touchstart', handleInitialInteraction);
    };
  }, [handleStart, disabled]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      handleMove(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const touch = event.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [handleMove, handleEnd]);

  return (
    <div
      ref={containerRef}
      className="joystick-container"
      style={{
        position: 'fixed',
        left: joystickCenterX - 75,
        top: joystickCenterY - 75,
      }}
    >
      <div
        className="joystick"
        style={{
          transform: `translate(${visualX}px, ${visualY}px)`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />
    </div>
  );
};

export default JoystickControl;
