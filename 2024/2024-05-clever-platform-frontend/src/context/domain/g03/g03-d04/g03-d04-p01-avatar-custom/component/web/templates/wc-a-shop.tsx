import { useTranslation } from 'react-i18next';

import ConfigJson from '../../../config/index.json';
import ShopMenuBody from '../molecules/wc-a-shop-menu-body';
import ShopMenuBodyEmpty from '../molecules/wc-a-shop-menu-body-empty';
import ShopMenuBodyGift from '../molecules/wc-a-shop-menu-body-gift';
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
  petData,
  inventory,
  rewardLogs,
  setShowProfileShare,
}: {
  onHandleClickMenu: (menu: number) => void;
  STATEFLOW: any;
  stateFlow: number;
  imageList: any[];
  onSelect: any;
  rewardLogs: any;
  selected: any;
  inventory: any;
  setShowModal: any;
  petData: any;
  setShowProfileShare: any;
  title?: string;
  coin?: string;
  coinArcade?: string;
}) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  console.log('Stateflow available: ', STATEFLOW);

  const renderShopMenuBody = () => {
    if (imageList.length === 0) {
      return (
        <ShopMenuBodyEmpty
          titleMenu={t('title')}
          coin={inventory?.gold_coin}
          coinArcade={inventory?.arcade_coin}
        />
      );
    }
    if (stateFlow === STATEFLOW.GiftHistory) {
      <ShopMenuBodyGift
        imageList={imageList}
      // onSelect={onSelect}
      // selected={selected}
      // onHandleClickMenu={onHandleClickMenu}
      />;
    }
    return (
      <ShopMenuBody
        imageList={imageList}
        onSelect={onSelect}
        selected={selected}
        onHandleClickMenu={onHandleClickMenu}
        rewardLogs={rewardLogs}
      />
    );
  };

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
          title={t('title')}
          coin={inventory?.gold_coin}
          coinArcade={inventory?.arcade_coin}
          setShowModal={setShowModal}
          onHandleClickMenu={onHandleClickMenu}
          rewardLogs={rewardLogs}
        />
      )}
      {stateFlow === STATEFLOW.Pet &&
        (imageList.length === 0 ? (
          <ShopMenuBodyEmpty
            titleMenu={t('title')}
            coin={inventory?.gold_coin}
            coinArcade={inventory?.arcade_coin}
          />
        ) : (
          <ShopPet
            imageList={imageList}
            onSelect={onSelect}
            selected={selected}
            title={t('title')}
            coin={inventory?.gold_coin}
            coinArcade={inventory?.arcade_coin}
            setShowModal={setShowModal}
            onHandleClickMenu={onHandleClickMenu}
            rewardLogs={rewardLogs}
            petData={petData}
          />
        ))}
      {stateFlow === STATEFLOW.Frame &&
        (imageList.length === 0 ? (
          <ShopMenuBodyEmpty
            titleMenu={t('title')}
            coin={inventory?.gold_coin}
            coinArcade={inventory?.arcade_coin}
          />
        ) : (
          <ShopFrame
            imageList={imageList}
            onSelect={onSelect}
            selected={selected}
            title={t('title')}
            coin={inventory?.gold_coin}
            coinArcade={inventory?.arcade_coin}
            setShowModal={setShowModal}
            onHandleClickMenu={onHandleClickMenu}
            setShowProfileShare={setShowProfileShare}
          />
        ))}
      {stateFlow === STATEFLOW.Honer &&
        (imageList.length === 0 ? (
          <ShopMenuBodyEmpty
            titleMenu={t('title')}
            coin={inventory?.gold_coin}
            coinArcade={inventory?.arcade_coin}
          />
        ) : (
          <ShopBadge
            imageList={imageList}
            onSelect={onSelect}
            selected={selected}
            title={t('title')}
            coin={inventory?.gold_coin}
            coinArcade={inventory?.arcade_coin}
            setShowModal={setShowModal}
            onHandleClickMenu={onHandleClickMenu}
          />
        ))}
      {stateFlow === STATEFLOW.Gift &&
        (imageList.length === 0 ? (
          <ShopMenuBodyEmpty
            titleMenu={t('title')}
            coin={inventory?.gold_coin}
            coinArcade={inventory?.arcade_coin}
          />
        ) : (
          <ShopGift
            imageList={imageList}
            onSelect={onSelect}
            selected={selected}
            title={t('title')}
            coin={inventory?.gold_coin}
            coinArcade={inventory?.arcade_coin}
            setShowModal={setShowModal}
            onHandleClickMenu={onHandleClickMenu}
            rewardLogs={rewardLogs}
          />
        ))}
      {stateFlow === STATEFLOW.GiftHistory &&
        (imageList.length === 0 ? (
          <ShopMenuBodyEmpty
            titleMenu={t('title')}
            coin={inventory?.gold_coin}
            coinArcade={inventory?.arcade_coin}
          />
        ) : (
          <ShopGift
            imageList={imageList}
            onSelect={onSelect}
            selected={selected}
            title={t('title')}
            coin={inventory?.gold_coin}
            coinArcade={inventory?.arcade_coin}
            setShowModal={setShowModal}
            onHandleClickMenu={onHandleClickMenu}
            rewardLogs={rewardLogs}
          />
        ))}
    </div>
  );
};

export default Shop;
