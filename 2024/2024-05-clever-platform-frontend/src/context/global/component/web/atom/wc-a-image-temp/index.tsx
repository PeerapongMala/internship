import { useState } from 'react';

interface ImageTempProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  tempSrc?: string;
  className?: string;
}

const ImageTemp = ({ src, alt, tempSrc, className, ...props }: ImageTempProps) => {
  const [imgSrc, setImgSrc] = useState(src || tempSrc);

  const handleError = () => {
    if (tempSrc) setImgSrc(tempSrc);
  };

  return (
    <img src={imgSrc} alt={alt} onError={handleError} className={className} {...props} />
  );
};

export default ImageTemp;
