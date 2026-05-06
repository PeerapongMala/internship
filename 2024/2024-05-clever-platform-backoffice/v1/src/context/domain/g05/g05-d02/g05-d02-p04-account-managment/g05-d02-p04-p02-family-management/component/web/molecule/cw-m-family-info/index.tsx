import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { HTMLAttributes, useEffect, useState } from 'react';

type FamilyInfoProps = HTMLAttributes<HTMLDivElement> & {
  familyId: number;
  ownerName: string;
};

const FamilyInfo = ({ familyId, ownerName, className, ...props }: FamilyInfoProps) => {
  return (
    <div {...props} className={cn('flex flex-col', className)}>
      <span>ID ครอบครัว : {familyId}</span>
      <span>Owner : {ownerName}</span>
    </div>
  );
};

export default FamilyInfo;
