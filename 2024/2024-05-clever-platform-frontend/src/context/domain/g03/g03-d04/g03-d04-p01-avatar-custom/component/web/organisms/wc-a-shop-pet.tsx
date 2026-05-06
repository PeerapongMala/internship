import ShopMenuBody from '../molecules/wc-a-shop-menu-body';
import ShopMenuFooter from '../molecules/wc-a-shop-menu-footer';
import ShopMenuHead from '../molecules/wc-a-shop-menu-head';

const ShopPet = ({
  imageList,
  onSelect,
  selected,
  title,
  setShowModal,
  coin,
  coinArcade,
  onHandleClickMenu,
  rewardLogs,
  petData,
}: {
  imageList: any[];
  onSelect: any;
  selected: any;
  title: string;
  setShowModal: any;
  coin: string;
  coinArcade: string;
  onHandleClickMenu: (menu: number) => void;
  rewardLogs: any;
  petData: any;
}) => {
  return (
    <div className="grid grid-rows-7 gap-1 w-full relative">
      <ShopMenuHead title={title} coin={coin} coinArcade={coinArcade} />
      <ShopMenuBody
        imageList={imageList}
        onSelect={onSelect}
        selected={selected}
        onHandleClickMenu={onHandleClickMenu}
        rewardLogs={rewardLogs}
      />
      <ShopMenuFooter selected={selected} setShowModal={setShowModal} />
    </div>
  );
};

export default ShopPet;
