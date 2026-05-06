import { useTranslation } from 'react-i18next';

import { Avatar } from '@component/web/molecule/wc-m-avatar';
import { UserData } from '@domain/g02/g02-d01/local/type';
import StoreGame from '@global/store/game';
import ImageCopyIcon from '../../../assets/icon-copy.svg';
import ConfigJson from '../../../config/index.json';
import { StateFlow } from '../../../type';
import { IconSmall } from '../atoms/wc-a-icon';

interface AccountProfileProps {
  profile?: UserData;
  className?: string;
  isCapture?: boolean;
}

export function AccountProfile({
  profile,
  className = '',
  isCapture,
}: AccountProfileProps) {
  const { t } = useTranslation([ConfigJson.key]);

  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  const userFullName = `${profile?.first_name} ${profile?.last_name}`;

  return (
    <div className={'flex-1 flex gap-2 ' + className}>
      <Avatar user={profile} className="w-[55px] h-[55px] p-1" />
      <div className="flex-1 flex flex-col">
        <span className="text-2xl font-bold text-gray-20 self-stretch">
          {stateFlow === StateFlow.Default ? userFullName : t('hide_identity_username')}
        </span>
        <div className="flex-1 flex justify-between w-full">
          <span className="text-base font-light">
            {t('uuid_tag', { uuid: profile?.id })}
          </span>
          {!isCapture && (
            <IconSmall
              src={ImageCopyIcon}
              className="cursor-pointer !z-50 active:scale-90 hover:scale-110"
              onClick={() => {
                navigator.clipboard.writeText(profile?.id ?? '');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
