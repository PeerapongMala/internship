import { useTranslation } from 'react-i18next';

import ConfigJson from '../../../config/index.json';
import ShopAvatar from '../organisms/wc-a-shop-avatar';
import ShopBadge from '../organisms/wc-a-shop-badge';
import ShopFrame from '../organisms/wc-a-shop-frame';
import ShopGift from '../organisms/wc-a-shop-gift';
import ShopMenu from '../organisms/wc-a-shop-menu';
import ShopPet from '../organisms/wc-a-shop-pet';

const Shop = ({
  STATEFLOW,
  onHandleClickMenu,
  stateFlow,
  imageList,
  onSelect,
  selected,
  setShowModal,
  inventory,
  handleBuy,
  onShowModalNotMoney,
}: {
  onHandleClickMenu: (menu: number) => void;
  STATEFLOW: any;
  stateFlow: number;
  imageList: any[];
  onSelect: any;
  selected: any;
  setShowModal: any;
  inventory: any;
  handleBuy?: (item: any) => void;
  onShowModalNotMoney?: () => void;
}) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <div
      className="flex gap-1 h-full w-full bg-white/90 rounded-[70px] border-8 border-white shadow-2xl z-30 overflow-y-auto"
      style={{
        zIndex: '100 !important',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(0, 0, 0, 0.3) transparent',
      }}
    >

      <ShopMenu
        STATEFLOW={STATEFLOW}
        onHandleClickMenu={onHandleClickMenu}
        stateFlow={stateFlow}
      />

      {stateFlow === STATEFLOW.Avatar && (
        <ShopAvatar
          imageList={imageList}
          onSelect={onSelect}
          selected={selected}
          title={t('shop')}
          coin={inventory?.gold_coin}
          arcadeCoin={inventory?.arcade_coin}
          setShowModal={setShowModal}
        />
      )}
      {stateFlow === STATEFLOW.Pet && (
        <ShopPet
          imageList={imageList}
          onSelect={onSelect}
          selected={selected}
          coin={inventory?.gold_coin}
          arcadeCoin={inventory?.arcade_coin}
          title={t('shop')}
          setShowModal={setShowModal}
        />
      )}
      {stateFlow === STATEFLOW.Frame && (
        <ShopFrame
          imageList={imageList}
          onSelect={onSelect}
          selected={selected}
          coin={inventory?.gold_coin}
          arcadeCoin={inventory?.arcade_coin}
          title={t('shop')}
          setShowModal={setShowModal}
        />
      )}
      {stateFlow === STATEFLOW.Honer && (
        <ShopBadge
          imageList={imageList}
          onSelect={onSelect}
          selected={selected}
          coin={inventory?.gold_coin}
          arcadeCoin={inventory?.arcade_coin}
          title={t('shop')}
          setShowModal={setShowModal}
        />
      )}
      {stateFlow === STATEFLOW.Gift && (
        <ShopGift
          imageList={imageList}
          onSelect={onSelect}
          selected={selected}
          coin={inventory?.gold_coin}
          arcadeCoin={inventory?.arcade_coin}
          title={t('shop')}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default Shop;
