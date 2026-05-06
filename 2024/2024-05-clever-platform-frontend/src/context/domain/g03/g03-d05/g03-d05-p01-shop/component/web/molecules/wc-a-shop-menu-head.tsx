import ShopMenuHeadItem from './wc-a-shop-menu-head-item';

const ShopMenuHead = ({
  title,
  coin,
  coinArcade,
}: {
  title: string;
  coin: string;
  coinArcade: string;
}) => {
  return (
    <div className="flex w-full h-full items-center justify-between rounded-tr-[70px] p-4 pr-20">
      <div className="text-2xl font-semibold">{title}</div>
      <ShopMenuHeadItem coin={coin} coinArcade={coinArcade} />
    </div>
  );
};

export default ShopMenuHead;
