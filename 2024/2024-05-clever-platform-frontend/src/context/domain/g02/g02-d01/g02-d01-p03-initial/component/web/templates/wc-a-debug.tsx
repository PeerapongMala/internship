import { useEffect, useState } from 'react';

import ImageBGDesign from '../../../assets/bg-design.png';

const Debug = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [opacityClassNames, setOpacityClassNames] = useState('opacity-50');
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const debugMode = localStorage.getItem('debugMode');
      if (debugMode === 'true') {
        if (event.ctrlKey) {
          setShowDebug((prev) => !prev);
        }
        if (event.metaKey) {
          if (opacityClassNames == 'opacity-50') {
            setOpacityClassNames('opacity-100');
          } else {
            setOpacityClassNames('opacity-50');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [opacityClassNames]);

  return (
    <div
      className={`absolute inset-0 bg-cover bg-bottom z-50 ${opacityClassNames} ${showDebug ? 'block' : 'hidden'}`}
      style={{ backgroundImage: `url(${ImageBGDesign})` }}
    ></div>
  );
};

export default Debug;
