import { Avatar, AvatarProps } from '@mantine/core';
import { useState, useEffect } from 'react';

type CWAvatarProps = AvatarProps & {};

//million-ignore
const CWAvatar = ({ src, ...props }: CWAvatarProps) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!src) return;

    const image = new Image();
    image.src = src;
    image.onload = () => setIsValid(true);
    image.onerror = () => setIsValid(false);
  }, [src]);

  return <Avatar src={isValid ? src : null} {...props} />;
};

export default CWAvatar;
