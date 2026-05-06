import { useTranslation } from 'react-i18next';

import ImageKing from '../../../assets/admin.svg';
import ConfigJson from '../../../config/index.json';

import { ArcadeLeaderboardData } from '@domain/g03/g03-d08/g03-d08-p02-arcade-leaderboard/types';
import { TextSubtitle } from '../atoms/wc-a-text';

export function AccountButtonList({ account }: { account: ArcadeLeaderboardData }) {
  const { t } = useTranslation([ConfigJson.id || 'defaultNamespace']);
  const isStatusWaiting = account.status === 'Waiting';

  return (
    <div
      className={`grid grid-cols-[64px_64px_400px_70px_200px] items-center gap-3 p-2 ${
        account.index % 2 === 0 ? 'bg-white' : 'bg-transparent'
      }`}
    >
      {/* Displaying Account Index */}
      <div className="bg-[#fcd401] rounded-3xl border-4 border-white w-[64px] h-[64px] shadow-red-500 flex items-center justify-center text-xl noto-sans-thai1200 text-gray-20">
        {account.index}
      </div>

      {/* Conditional Avatar Image with Fallback */}
      <div>
        {account.avatarImage ? (
          <img
            src={account.avatarImage}
            alt={`${account.username}'s avatar`}
            className="rounded-full border-2 border-white w-[64px] h-[64px]"
          />
        ) : (
          <div className="w-[64px] h-[64px] rounded-full bg-gray-300 flex items-center justify-center">
            {t('no_avatar')}
          </div>
        )}
      </div>

      {/* Username and King Icon for index 1 only */}
      <div className="flex items-center gap-2">
        {account.index === 1 && (
          <img src={ImageKing} className="w-[22px] h-[22px]" alt="King Icon" />
        )}
        <TextSubtitle className="!font-bold">{account.username}</TextSubtitle>
      </div>

      {/* Score */}
      <TextSubtitle className="text-right !font-bold">
        {account.score.toLocaleString()}
      </TextSubtitle>

      {/* Time */}
      <TextSubtitle className="text-right !font-bold">{account.time}</TextSubtitle>
    </div>
  );
}

export default AccountButtonList;
