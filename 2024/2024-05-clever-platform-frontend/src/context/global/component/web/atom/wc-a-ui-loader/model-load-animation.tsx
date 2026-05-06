import StoreGlobal from '../../../../store/global';

import { LottieComponentProps, useLottie } from 'lottie-react';
import { useEffect, useState } from 'react';

const WCAUILoader = (props: any) => {
  const { loadingIs } = StoreGlobal.StateGet(['loadingIs']);
  const [backgroundAnimation, setBackgroundAnimation] = useState();

  const AnimationBackgroundDefault = new URL(
    '/assets/particle/loader.json',
    import.meta.url,
  ).href;
  const options: LottieComponentProps = {
    animationData: backgroundAnimation,
    loop: true,
  };

  const lottie = useLottie(options);
  lottie.setSpeed(1.5);

  const { View } = lottie;

  useEffect(() => {
    fetch(AnimationBackgroundDefault)
      .then((response) => response.json())
      .then((data) => {
        setBackgroundAnimation(data);
      })
      .catch((error) => {
        console.error('Error loading animation:', error);
      });
  }, [AnimationBackgroundDefault]);

  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      <>
        <div className="absolute w-[20%] z-50">{View}</div>
        <div className="absolute h-full w-full opacity-50 bg-black z-40" />
      </>

      <div className="absolute top-0 left-0 w-full h-full">{props.children}</div>
    </div>
  );
};

export default WCAUILoader;
