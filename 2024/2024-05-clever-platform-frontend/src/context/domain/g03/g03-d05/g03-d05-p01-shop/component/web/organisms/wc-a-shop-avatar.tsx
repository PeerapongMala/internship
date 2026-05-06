import ShopMenuBody from '../molecules/wc-a-shop-menu-body';
import ShopMenuFooter from '../molecules/wc-a-shop-menu-footer';
import ShopMenuHead from '../molecules/wc-a-shop-menu-head';

const ShopAvatar = ({
  imageList,
  onSelect,
  selected,
  title,
  setShowModal,
  coin,
  arcadeCoin,
}: {
  imageList: any[];
  onSelect: any;
  selected: any;
  title: string;
  coin: string;
  arcadeCoin: string;
  setShowModal: any;
}) => {
  return (
    <div className="grid grid-rows-7 gap-1 w-full relative">
      <ShopMenuHead title={title} coin={coin} coinArcade={arcadeCoin} />
      <ShopMenuBody imageList={imageList} onSelect={onSelect} selected={selected} />
      <ShopMenuFooter selected={selected} setShowModal={setShowModal} />
    </div>
  );
};

export default ShopAvatar;
