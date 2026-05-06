import ImageTemp from '@component/web/atom/wc-a-image-temp';
import { UserData } from '@domain/g02/g02-d01/local/type';
import { cn } from '@global/helper/cn';
import { hashUserDataToNumber } from '@global/helper/hash';

import ImageIconAvatar1 from '/assets/character/icon-avatar-1.svg';
import ImageIconAvatar2 from '/assets/character/icon-avatar-2.svg';
import ImageIconAvatar3 from '/assets/character/icon-avatar-3.svg';

interface IAvatarProps {
  user?: Partial<UserData> | null;
  alt?: string;
  className?: string;
}

const AVATAR_FALLBACK_SOURCES = [ImageIconAvatar1, ImageIconAvatar2, ImageIconAvatar3];

export function Avatar({ user, alt, className }: IAvatarProps) {
  const imageSrc = user?.image_url;
  let tempImageSrc = user?.temp_image;

  if (!tempImageSrc) {
    if (user) {
      // choose an temporary avatar for user based on their school code and student id
      const hashingUserNumber = hashUserDataToNumber(user);
      const avatarNumber = Math.abs(hashingUserNumber % AVATAR_FALLBACK_SOURCES.length);
      tempImageSrc = AVATAR_FALLBACK_SOURCES[avatarNumber];
    } else {
      tempImageSrc = ImageIconAvatar1; // default fallback image
    }
  }

  return (
    <ImageTemp
      src={imageSrc ?? ''}
      tempSrc={tempImageSrc}
      className={cn('rounded-full object-cover', className)}
      alt={
        alt ??
        (user ? `${user?.first_name ?? ''} ${user?.last_name ?? ''}'s avatar` : 'avatar')
      }
    />
  );
}
