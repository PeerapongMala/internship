// FamilyProfile.tsx
import CWAvatar from '@component/web/atom/cw-a-avatar';
import { Avatar } from '@mantine/core';
import React from 'react';

type FamilyProfileProps = {
  src?: string | null;
  alt?: string;
  className?: string;
};

const FamilyProfile: React.FC<FamilyProfileProps> = ({
  src,
  alt = 'Family Profile Picture',
  className = '',
}) => {
  return (
    <CWAvatar
      src={src || ''}
      alt={alt}
      className={`h-20 w-20 rounded-full object-cover ${className}`}
    />
  );
};

export default FamilyProfile;
