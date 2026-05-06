import { useEffect, useState } from 'react';

import ImageBGDesign1 from '../../../assets/bg-design-1.png';

const Debug = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [opacityClassNames, setOpacityClassNames] = useState('opacity-50');
  const [backgroundImageIndex, setBackgroundImageIndex] = useState(0);

  const backgroundImages = [ImageBGDesign1];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const debugMode = localStorage.getItem('debugMode');
      if (debugMode === 'true') {
        if (event.ctrlKey) {
          setShowDebug((prev) => !prev);
        }
        if (event.metaKey) {
          if (opacityClassNames === 'opacity-50') {
            setOpacityClassNames('opacity-100');
          } else {
            setOpacityClassNames('opacity-50');
          }
        }
        if (event.key === 'ArrowRight') {
          setBackgroundImageIndex(
            (prevIndex) => (prevIndex + 1) % backgroundImages.length,
          );
        }
        if (event.key === 'ArrowLeft') {
          setBackgroundImageIndex(
            (prevIndex) =>
              (prevIndex - 1 + backgroundImages.length) % backgroundImages.length,
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [opacityClassNames, backgroundImages.length]);

  return (
    <div
      className={`absolute inset-0 bg-cover bg-bottom z-[90] ${opacityClassNames} ${showDebug ? 'block' : 'hidden'}`}
      style={{ backgroundImage: `url(${backgroundImages[backgroundImageIndex]})` }}
    ></div>
  );
};

export default Debug;
