import StoreGame from '@global/store/game';
import ShopMenuBody from '../molecules/wc-a-shop-menu-body';
import ShopMenuBodyEmpty from '../molecules/wc-a-shop-menu-body-empty';
import ShopMenuBodyGift from '../molecules/wc-a-shop-menu-body-gift';
import ShopMenuFooter from '../molecules/wc-a-shop-menu-footer';
import ShopMenuHead from '../molecules/wc-a-shop-menu-head';
import ShopMenuHeadGift from '../molecules/wc-a-shop-menu-head-gift';

interface ShopAvatarProps {
  imageList: any[];
  onSelect: any;
  selected: any;
  title: string;
  setShowModal: any;
  coin: string;
  coinArcade: string;
  onHandleClickMenu: any;
  STATEFLOW: any;
  rewardLogs: any;
}

const ShopAvatar: React.FC<ShopAvatarProps> = ({
  imageList,
  onSelect,
  selected,
  title,
  setShowModal,
  onHandleClickMenu,
  coin,
  coinArcade,
  STATEFLOW,
  rewardLogs,
}) => {
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  const renderShopMenuBody = () => {
    // if (imageList.length === 0) {
    //   return <ShopMenuBodyEmpty />;
    // }
    if (stateFlow === STATEFLOW.GiftHistory) {
      return (
        <ShopMenuBodyGift
          imageList={imageList}
          //onSelect={onSelect}
          //selected={selected}
          //onHandleClickMenu={onHandleClickMenu}
        />
      );
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
    <div className="flex flex-col gap-1 w-full relative">
      <div className="min-h-[87px] max-h-[87px]">
        <ShopMenuHead title={title} coin={coin} coinArcade={coinArcade} />
      </div>
      {(stateFlow === STATEFLOW.Gift || stateFlow === STATEFLOW.GiftHistory) && (
        <ShopMenuHeadGift onHandleClickMenu={onHandleClickMenu} />
      )}
      {renderShopMenuBody()}
      {stateFlow === STATEFLOW.Avatar && (
        <ShopMenuFooter selected={selected} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default ShopAvatar;
