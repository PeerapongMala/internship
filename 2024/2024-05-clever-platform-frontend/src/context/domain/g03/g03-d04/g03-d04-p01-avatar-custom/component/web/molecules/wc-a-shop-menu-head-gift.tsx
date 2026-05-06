import { useTranslation } from 'react-i18next';

import StoreGame from '@global/store/game';
import ImageIconLineLeft from '../../../assets/arrow-line-left.png';
import ImageIconLightBulb from '../../../assets/icon-light-bulb.png';
import ConfigJson from '../../../config/index.json';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';

const ShopMenuBodyGift = ({
  onHandleClickMenu,
}: {
  onHandleClickMenu: (menu: number) => void;
}) => {
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  return (
    <>
      {stateFlow === STATEFLOW.Gift && <Gift onHandleClickMenu={onHandleClickMenu} />}
      {stateFlow === STATEFLOW.GiftHistory && (
        <GiftHistory onHandleClickMenu={onHandleClickMenu} />
      )}
    </>
  );
};

const GiftHistory = ({
  onHandleClickMenu,
}: {
  onHandleClickMenu: (menu: number) => void;
}) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <div className="flex gap-2 w-full bg-white text-xl font-semibold border-2 border-slate-100 p-2 pl-4 items-center">
      <img
        src={ImageIconLineLeft}
        className="h-8 cursor-pointer"
        onClick={() => onHandleClickMenu(STATEFLOW.Gift)}
      />
      <div className="flex w-full justify-between pr-4">
        <div>{t('history')}</div>
      </div>
    </div>
  );
};

const Gift = ({ onHandleClickMenu }: { onHandleClickMenu: (menu: number) => void }) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <div className="flex gap-2 w-full bg-white text-xl font-semibold border-2 border-slate-100 p-2 pl-4 items-center relative">
      <img src={ImageIconLightBulb} className="h-8" />
      <div className="flex w-full justify-between pr-4">
        <div>{t('make_mission')}</div>
        <div
          className="underline cursor-pointer"
          onClick={() => onHandleClickMenu(STATEFLOW.GiftHistory)}
        >
          {t('gift_history')}
        </div>
      </div>
    </div>
  );
};
export default ShopMenuBodyGift;
