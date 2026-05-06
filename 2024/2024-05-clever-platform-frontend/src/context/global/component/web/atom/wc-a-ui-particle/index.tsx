import { SubjectListItem } from '@domain/g02/g02-d02/local/type';
import StoreGlobal from '@store/global';
import StoreGlobalPersist from '@store/global/persist';
import StoreSubjects from '@store/global/subjects';
import { LottieComponentProps, useLottie } from 'lottie-react';
import { useEffect, useState } from 'react';

const WCAUIParticle = ({ children }: any) => {
  const { settings } = StoreGlobalPersist.StateGet(['settings']);
  const { imageBackgroundUrl } = StoreGlobal.StateGet(['imageBackgroundUrl']);
  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']) as {
    currentSubject: SubjectListItem;
  };

  const AnimationBackgroundDefault = new URL(
    '/assets/particle/spring.json',
    import.meta.url,
  ).href;

  const [backgroundAnimation, setBackgroundAnimation] = useState();
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>();

  // Fetch animation data
  useEffect(() => {
    const fetchAnimation = async () => {
      try {
        const response = await fetch(AnimationBackgroundDefault);
        const data = await response.json();
        setBackgroundAnimation(data);
      } catch (error) {
        console.error('Error loading animation:', error);
      }
    };

    fetchAnimation();
  }, [AnimationBackgroundDefault]);

  // Check if a URL is a valid image
  const checkImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });

      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.startsWith('image/')) {
        console.warn('URL is not an image:', url, 'Content-Type:', contentType);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking image URL:', error);
      return false;
    }
  };

  // Handle background image logic
  useEffect(() => {
    const applyFallbackImage = () => {
      const fallbackImage = new URL(
        '/assets/images/background/menu/menu1.png',
        import.meta.url,
      ).href;
      setBackgroundImage(fallbackImage);
      console.warn('Fallback image background applied:', fallbackImage);
    };

    const setImageBackgroundFromSubjectGroup = () => {
      if (currentSubject?.seed_subject_group_id) {
        StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
          currentSubject.seed_subject_group_id,
        );
      } else {
        applyFallbackImage();
      }
    };

    const handleBackgroundImage = async () => {
      if (imageBackgroundUrl) {
        const imageBackground = new URL(imageBackgroundUrl, import.meta.url).href;

        const isValid = await checkImageUrl(imageBackground);
        if (isValid) {
          setBackgroundImage(imageBackground);
        } else {
          setImageBackgroundFromSubjectGroup();
        }
      } else {
        setImageBackgroundFromSubjectGroup();
      }
    };

    handleBackgroundImage();
  }, [imageBackgroundUrl, currentSubject]);

  return (
    <div className="w-full h-screen flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      {settings?.enableParticle && (
        <div className="absolute w-full h-full opacity-50">
          <RenderParticle backgroundAnimation={backgroundAnimation} />
        </div>
      )}
      <div className="absolute top-0 left-0 w-full h-full">{children}</div>
    </div>
  );
};

const RenderParticle = ({ backgroundAnimation }: { backgroundAnimation: any }) => {
  const { width, height } = window.screen;

  const lottieOptions: LottieComponentProps = {
    animationData: backgroundAnimation,
    loop: true,
    style: { width, height },
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };

  const lottie = useLottie(lottieOptions);
  lottie.setSpeed(0.5);

  const { View } = lottie;

  return <>{View}</>;
};

export default WCAUIParticle;
