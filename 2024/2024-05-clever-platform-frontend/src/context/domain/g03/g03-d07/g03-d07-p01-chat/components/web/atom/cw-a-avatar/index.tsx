import { cn } from '@global/helper/cn';
import { ImgHTMLAttributes } from 'react';

type AvatarProps = ImgHTMLAttributes<HTMLImageElement> & {};

const Avatar = ({ src, className }: AvatarProps) => {
  return (
    <img
      className={cn('h-8 w-8 rounded-full', className)}
      src={src ?? 'assets/global/avatar-default.png'}
    />
  );
};

export default Avatar;
