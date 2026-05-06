import { useEffect } from 'react';

const useOrientationCheck = (onWrongAngle: (wrong: boolean) => void) => {
  useEffect(() => {
    const checkOrientation = () => {
      // 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary'
      const orientationType = window.screen.orientation?.type;
      //support for older browsers
      const isPortrait =
        typeof orientationType === 'string'
          ? orientationType.startsWith('portrait')
          : window.innerHeight > window.innerWidth;
      onWrongAngle(isPortrait);
    };

    checkOrientation(); // ตรวจสอบ

    window.addEventListener('resize', checkOrientation);
    window.screen.orientation?.addEventListener('change', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.screen.orientation?.removeEventListener('change', checkOrientation);
    };
  }, [onWrongAngle]);
};

export default useOrientationCheck;
