import { convertToMonetarySuffix } from '@global/helper/convert';
import ImageCoinArcade from '../../../assets/coin-arcade.svg';
import ImageCoinGame from '../../../assets/coin-game.svg';
import ImageStars from '../../../assets/stars.svg';
import { IconSmall } from '../atoms/wc-a-icon';
import { TextNormal } from '../atoms/wc-a-text';

interface CurrencyStatBoxProps {
  currency: {
    coin?: number;
    key?: number;
    stars?: number
  };
  className?: string;
}

export function CurrencyStatBox({
  currency: { coin = 0, key = 0, stars = 0 },
  className = '',
}: CurrencyStatBoxProps) {
  return (
    <div
      className={
        'flex justify-center items-center gap-2 divide-x-2 divide-solid divide-secondary ' +
        className
      }
    >
      <div className="flex justify-center items-center gap-2">
        <IconSmall src={ImageCoinGame} />
        <TextNormal>{convertToMonetarySuffix(coin)}</TextNormal>
      </div>
      <div className="flex justify-center items-center gap-2 pl-2">
        <IconSmall src={ImageCoinArcade} />
        <TextNormal>{convertToMonetarySuffix(key)}</TextNormal>
      </div>
      <div className="flex justify-center items-center gap-2 pl-2">
        <IconSmall src={ImageStars} />
        <TextNormal>{convertToMonetarySuffix(stars)}</TextNormal>
      </div>
    </div>
  );
}

export default CurrencyStatBox;
