import React, { useState, useEffect } from 'react';
import './JoystickControl.css';

const maxSpeed = 0.1;

let currentOffX = 0;
let currentOffY = 0;

let lastTime;
const JoystickControl = ({ playerCharacter }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  let isDisposed = false;

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartX(event.clientX - currentX); // ตั้งค่า startX โดยไม่รีเซ็ตค่า currentX
    setStartY(event.clientY - currentY); // ตั้งค่า startY โดยไม่รีเซ็ตค่า currentY
  };

  const handleMouseUp = () => {
    ((currentOffY = 0), (currentOffX = 0));
    setIsDragging(false);
    setCurrentX(0);
    setCurrentY(0);
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const handleMouseMove = (event) => {
    if (isDragging) {
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;

      // Update the player's position based on the dragging distance

      //playerCharacter.position.x += clampedX;
      //playerCharacter.position.z += clampedZ;

      // Update current positions
      currentOffX = dx;
      currentOffY = dy;
      setCurrentX(dx);
      setCurrentY(dy);
    }
  };

  useEffect(() => {
    console.log('using frame');

    function animate() {
      if (isDisposed) {
        console.log('disposing');
        return;
      }

      if (!lastTime) {
        lastTime = performance.now();
      }
      const time = performance.now();
      const deltaTime = (time - lastTime) / 1000; // หา deltaTime ในวินา��ี
      if (isDragging) {
        const dx = currentOffX;
        const dy = currentOffY;

        const clampedX = clamp(dx * 0.0005, -maxSpeed, maxSpeed);
        const clampedZ = clamp(dy * 0.0005, -maxSpeed, maxSpeed);

        playerCharacter.position.x += clampedX; //* 0.0005;
        playerCharacter.position.z += clampedZ; //* 0.0005;//* 0.0005;
      }

      lastTime = time; // update lastTime ใหม่เมื่อทำงานเสร็จ
      requestAnimationFrame(animate);
    }

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      isDisposed = true;
      //cancelAnimationFrame(animate);
    };
  }, [isDragging, startX, startY, playerCharacter]);

  return (
    <div className="joystick-container">
      <div
        className="joystick"
        style={{ transform: `translate(${currentX}px, ${currentY}px)` }}
        onMouseDown={(event) => {
          setIsDragging(true);
          setStartX(event.clientX - currentX); // ตั้งค่า startX โดยไม่รีเซ็ตค่า currentX
          setStartY(event.clientY - currentY); // ตั้งค่า startY โดยไม่รีเซ็ตค่า currentY
        }}
      />
    </div>
  );
};

export default JoystickControl;
