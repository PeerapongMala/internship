import { Avatar } from '@component/web/molecule/wc-m-avatar';
import {
  MinigameList,
  UserDetail,
} from '@domain/g03/g03-d08/g03-d08-p02-arcade-leaderboard/types';
import Button from '@global/component/web/atom/wc-a-button';
import KeyPrice from '../../../../assets/coin-arcade.svg';

interface LeaderBoardHeaderProps {
  info?: MinigameList | null;
  account?: AccountList[] | null;
  userDetail?: UserDetail | null;
  onBackClick?: () => void;
  onArcadeCoinCostClick?: () => void;
}

interface AccountList {
  index: number;
  avatarImage: string;
  username: string;
  score: number;
  time: string;
  coin?: number;
  price?: number;
}

export function LeaderBoardHeader({
  info,
  account,
  userDetail,
  onBackClick,
  onArcadeCoinCostClick,
}: LeaderBoardHeaderProps) {
  function formatCoin(value: number): string {
    if (value >= 1_000_000) {
      const formatted = (value / 1_000_000).toFixed(3);
      return formatted.endsWith('.000') ? formatted.slice(0, -4) + 'm' : formatted + 'm';
    } else if (value >= 1_000) {
      const formatted = (value / 1_000).toFixed(3);
      return formatted.endsWith('.000') ? formatted.slice(0, -4) + 'k' : formatted + 'k';
    }
    return value.toString();
  }

  const isTitleOnly =
    info && !info.image_url && !info.arcade_coin_cost && Object.keys(info).length === 1;

  return (
    <div className="absolute top-3 left-28 grid grid-cols-[auto] items-center gap-4">
      {isTitleOnly ? (
        <div className="grid grid-cols-[1000px] text-2xl px-10 py-4 box-border bg-white bg-opacity-80 rounded-[20px] text-gray-20">
          {info.name ? ` ${info.name}` : ''}
        </div>
      ) : (
        <div className="grid grid-cols-[100px_600px_200px_200px] items-center gap-4 ml-3">
          {info?.image_url ? (
            <img
              src={info.image_url}
              className="h-[64px] rounded-[16px]"
              alt="Game Icon"
            />
          ) : (
            <div className="h-[64px] w-[64px] bg-gray-200 rounded-[16px]" />
          )}

          <div
            className="flex-1 text-2xl px-10 py-4 box-border bg-white bg-opacity-80 rounded-[20px] text-gray-20"
            style={{ boxShadow: '0px 2px 0px 0px #DFDEDE' }}
          >
            {info?.name}
          </div>

          {userDetail && userDetail ? (
            <Button
              className="w-full"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
              prefix={
                userDetail && userDetail.arcade_coin > '0' ? (
                  <div className="min-w-[48px]">
                    <Avatar
                      user={userDetail}
                      className="border-2 border-white h-[48px] w-[48px]"
                    />
                  </div>
                ) : (
                  <div className="rounded-full border-2 border-white h-[48px] w-[48px] bg-gray-200"></div>
                )
              }
              variant="white"
            >
              <img src={KeyPrice} alt="Icon" className="w-[28px] h-[60px] pr-1" />
              {userDetail
                ? formatCoin(
                    userDetail?.arcade_coin ? parseFloat(userDetail.arcade_coin) : 0,
                  )
                : formatCoin(0)}
            </Button>
          ) : (
            <Button className="w-full" variant="white">
              ไม่มีข้อมูลบัญชี
            </Button>
          )}

          {info?.arcade_coin_cost ? (
            <Button
              className="w-full"
              prefix={<img src={KeyPrice} alt="Icon" className="w-10 h-full" />}
              variant="primary"
              onClick={onArcadeCoinCostClick}
            >
              {info.arcade_coin_cost}
            </Button>
          ) : (
            <Button className="w-full" variant="primary">
              ไม่มีข้อมูลราคา
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default LeaderBoardHeader;
