import React, {
  CSSProperties,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

interface HighlightBoxProps {
  targetRef: MutableRefObject<HTMLDivElement | null>; // Ref to the target element
  animationOrder?: number; // Optional animation order
  onAnimationComplete?: () => void; // Optional callback when animation completes
}

const HighlightBox: React.FC<HighlightBoxProps> = ({
  targetRef,
  animationOrder,
  onAnimationComplete,
}) => {
  const boxRef = useRef<HTMLDivElement | null>(null); // Ref for the box element, typed as HTMLDivElement or null
  const [position, setPosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  }); // Initial state with type

  useEffect(() => {
    if (!targetRef.current) return; // Ensure targetRef is valid

    const targetRect = targetRef.current.getBoundingClientRect(); // Get position of the target element

    // Initial positioning (outside screen or somewhere not visible if you prefer)
    setPosition({
      x: window.innerWidth, // Start off-screen to the right (adjust as needed)
      y: targetRect.y,
      opacity: 0, // Initially hidden
    });

    // Start animation when component mounts (or based on a trigger - we'll refine this later)
    startAnimation(targetRect);
  }, [targetRef, animationOrder, onAnimationComplete]); // Dependencies for useEffect

  const startAnimation = (targetRect: DOMRect) => {
    // Type the parameter
    const Tween = require('@tweenjs/tween.js').Tween; // Import Tween properly for TypeScript - CommonJS import

    const initialPosition = { ...position }; // Starting position
    const targetPosition = {
      x: targetRect.x, // Move to the target element's X position
      y: targetRect.y, // Move to the target element's Y position
      opacity: 0.7, // Fade in to semi-transparent (adjust opacity as needed)
    };

    new Tween(initialPosition)
      .to(targetPosition, 1000) // Animate over 1000ms (1 second) - adjust duration
      .easing(Tween.Easing.Quadratic.Out) // Easing function for smooth animation
      .onUpdate(() => {
        setPosition({ ...initialPosition }); // Update state during animation
      })
      .onComplete(() => {
        if (onAnimationComplete) {
          onAnimationComplete(); // Call completion callback when animation finishes
        }
      })
      .start();
  };

  const boxStyle: CSSProperties = {
    // Define CSSProperties type for style
    position: 'fixed', // Fixed position relative to viewport
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black (adjust color/opacity)
    pointerEvents: 'none', // Make boxes non-interactive
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${targetRef.current ? targetRef.current.offsetWidth : 50}px`, // Match target element width (default 50px if ref not ready yet)
    height: `${targetRef.current ? targetRef.current.offsetHeight : 50}px`, // Match target element height (default 50px)
    opacity: position.opacity,
    transition: 'opacity 0.3s ease-in-out', // Optional: for fade-in even without tween.js
  };

  return <div ref={boxRef} style={boxStyle} />;
};

export default HighlightBox;
