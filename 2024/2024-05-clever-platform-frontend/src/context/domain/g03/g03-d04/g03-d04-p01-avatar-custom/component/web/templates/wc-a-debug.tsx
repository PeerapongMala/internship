import { useEffect, useState } from 'react';

import ImageBGDesign1 from '../../../assets/bg-design-1.png';
import ImageBGDesign2 from '../../../assets/bg-design-2.png';
import ImageBGDesign3 from '../../../assets/bg-design-3.png';
import ImageBGDesign4 from '../../../assets/bg-design-4.png';
import ImageBGDesign5 from '../../../assets/bg-design-5.png';
import ImageBGDesign6 from '../../../assets/bg-design-6.png';
import ImageBGDesign7 from '../../../assets/bg-design-7.png';
import ImageBGDesign8 from '../../../assets/bg-design-8.png';
import ImageBGDesign9 from '../../../assets/bg-design-9.png';
import ImageBGDesign10 from '../../../assets/bg-design-10.png';
import ImageBGDesign11 from '../../../assets/bg-design-11.png';
import ImageBGDesign12 from '../../../assets/bg-design-12.png';

const Debug = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [opacityClassNames, setOpacityClassNames] = useState('opacity-50');
  const [backgroundImageIndex, setBackgroundImageIndex] = useState(0);

  const backgroundImages = [
    ImageBGDesign1,
    ImageBGDesign2,
    ImageBGDesign3,
    ImageBGDesign4,
    ImageBGDesign5,
    ImageBGDesign6,
    ImageBGDesign7,
    ImageBGDesign8,
    ImageBGDesign9,
    ImageBGDesign10,
    ImageBGDesign11,
    ImageBGDesign12,
  ];

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
