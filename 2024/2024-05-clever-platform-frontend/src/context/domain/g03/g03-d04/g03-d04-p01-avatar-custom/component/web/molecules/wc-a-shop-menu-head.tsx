// ShopMenuHead component
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
  console.log('ShopMenuHead rendering with:', { title, coin, coinArcade });

  return (
    <div className="flex w-full h-full items-center justify-between rounded-tr-[70px] p-4 pr-20">
      <div className="text-2xl font-semibold">{title || 'Title not provided'}</div>
      <ShopMenuHeadItem coin={coin} coinArcade={coinArcade} />
    </div>
  );
};

export default ShopMenuHead;
