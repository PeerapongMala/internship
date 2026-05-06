import { useTranslation } from 'react-i18next';

import { UserData } from '@domain/g02/g02-d01/local/type';
import Button from '@global/component/web/atom/wc-a-button';
import StoreGame from '@global/store/game';
import ConfigJson from '../../../config/index.json';
import { StateFlow } from '../../../type';
import { AccountProfile } from '../organisms/wc-a-account-profile';

interface ProfileSectionProps {
  profile?: UserData;
  className?: string;
  isCapture?: boolean;
}

export function ProfileSection({
  profile,
  className = '',
  isCapture,
}: ProfileSectionProps) {
  const { t } = useTranslation([ConfigJson.key]);

  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  return (
    <div className={'flex justify-between pr-6 gap-4 w-full ' + className}>
      <AccountProfile profile={profile} isCapture={isCapture} />
    </div>
  );
}

export default ProfileSection;
