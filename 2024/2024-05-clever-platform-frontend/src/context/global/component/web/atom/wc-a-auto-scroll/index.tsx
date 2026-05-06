import { useEffect, useRef } from 'react';

interface AutoScrollProps {
  children: React.ReactNode;
  className?: string;
  animationDuration?: number; // Add a prop for custom animation duration
}

const AutoScroll = ({
  children,
  className = '',
  animationDuration = 20,
}: AutoScrollProps) => {
  const autoscrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const autoscrollDiv = autoscrollRef.current;

    if (autoscrollDiv) {
      // Add dynamic style to the autoscroll div
      autoscrollDiv.style.animation = `scrollLeft ${animationDuration}s linear infinite`;

      const checkOverflow = () => {
        if (autoscrollDiv.scrollWidth > autoscrollDiv.clientWidth) {
          autoscrollDiv.classList.add('animate-scroll-left');
        } else {
          autoscrollDiv.classList.remove('animate-scroll-left');
        }
      };

      checkOverflow();
      window.addEventListener('resize', checkOverflow);

      return () => {
        window.removeEventListener('resize', checkOverflow);
      };
    }
  }, [animationDuration]); // Add animationDuration as a dependency

  return (
    <div
      ref={autoscrollRef}
      className={`autoscroll flex whitespace-nowrap animate-scroll-left items-center ${className}`}
    >
      {children}
    </div>
  );
};

export default AutoScroll;
