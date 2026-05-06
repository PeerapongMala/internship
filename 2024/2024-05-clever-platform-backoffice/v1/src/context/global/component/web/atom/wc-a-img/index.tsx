import IconImgNotFound from '@core/design-system/library/component/icon/IconImgNotFound';
import { ImgHTMLAttributes, useEffect, useState } from 'react';

type CWImgProps = ImgHTMLAttributes<HTMLImageElement> & {};

const CWImg = ({ src, alt, className, width = 20, height = 20 }: CWImgProps) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!src) return;

    const image = new Image();
    image.src = src;
    image.onload = () => setIsValid(true);
    image.onerror = () => setIsValid(false);
  }, [src]);

  return isValid ? (
    <img className={className} src={src} alt={alt} width={width} height={height} />
  ) : (
    <IconImgNotFound className={className} width={width} height={height} />
  );
};

export default CWImg;
