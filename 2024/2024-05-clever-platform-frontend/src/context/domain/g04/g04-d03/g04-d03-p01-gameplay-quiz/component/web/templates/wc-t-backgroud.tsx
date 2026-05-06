import { useEffect, useState } from 'react';

const BackgroudImage = ({ src }: { src?: string }) => {
  const ImageDefault = new URL('/assets/images/background/map/map1.png', import.meta.url)
    .href;

  const [backgroundImage, setBackgroundImage] = useState('');

  const handleErrors = () => {
    console.error('Error loading image:', src, 'fallback to default image');
    setBackgroundImage(ImageDefault);
  };

  useEffect(() => {
    if (src) {
      console.log('Loading image:', src);

      setBackgroundImage(src);
    }
  }, [src]);

  return (
    <img
      className="w-full h-full object-cover"
      src={backgroundImage}
      onError={handleErrors}
    />
  );
};

export default BackgroudImage;
