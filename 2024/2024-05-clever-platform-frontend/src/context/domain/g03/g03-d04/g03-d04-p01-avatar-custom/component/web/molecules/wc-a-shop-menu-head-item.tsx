import { convertToMonetarySuffix } from '@global/helper/convert';
import ImageIconCoinArcade from '../../../assets/icon-coin-arcade.png';
import ImageIconCoin from '../../../assets/icon-coin.png';
import CoinItem from '../atoms/wc-a-coin-item';

const ShopMenuHeadItem = ({ coin, coinArcade }: { coin: string; coinArcade: string }) => {
  return (
    <div className="flex gap-2 h-full items-center justify-center">
      <CoinItem iconSrc={ImageIconCoin} value={convertToMonetarySuffix(coin)} />
      <div className="text-4xl font-normal text-secondary">|</div>
      <CoinItem
        iconSrc={ImageIconCoinArcade}
        value={convertToMonetarySuffix(coinArcade)}
      />
    </div>
  );
};

export default ShopMenuHeadItem;
