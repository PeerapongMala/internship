import { useTranslation } from 'react-i18next';

import ImageAvatar from '../../../assets/icon-avatar-1.svg';
import ImageIconCheck from '../../../assets/icon-check.svg';
import ImageIconClock from '../../../assets/icon-clock.svg';
import ConfigJson from '../../../config/index.json';
import { UploadHistoryData } from '../../../types';
import { TextAccountDate, TextSubtitle } from '../atoms/wc-a-text';

export function AccountButtonList({ account }: { account: UploadHistoryData }) {
  const { t } = useTranslation([ConfigJson.key]);
  const isStatusWaiting = account.status === 'Waiting';
  return (
    <div className="flex items-center justify-center p-2 gap-2 bg-white rounded-full">
      <img
        src={account?.avatarImage ?? ImageAvatar}
        className="rounded-full w-[64px] h-[64px]"
      />
      <div className="flex flex-1 flex-col h-full">
        <TextSubtitle className="!font-bold">{account.username}</TextSubtitle>
        <TextAccountDate>
          {t(isStatusWaiting ? 'last_login' : 'latest_uploaded', {
            date: new Date(account.lastLogin).toLocaleDateString('th'),
          })}
        </TextAccountDate>
      </div>
      <div
        className={
          'w-[32px] h-[32px] rounded-full flex items-center justify-center ' +
          (isStatusWaiting
            ? 'bg-[#ff6b00]' // orange background-color
            : 'bg-[#26d93b]') // green background-color
        }
      >
        <img
          src={isStatusWaiting ? ImageIconClock : ImageIconCheck}
          className="w-4 h-4"
        />
      </div>
    </div>
  );
}

export default AccountButtonList;
