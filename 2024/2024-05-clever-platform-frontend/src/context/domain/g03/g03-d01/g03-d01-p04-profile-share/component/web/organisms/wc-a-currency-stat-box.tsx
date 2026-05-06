import ImageCoinArcade from '../../../assets/coin-arcade.svg';
import ImageCoinGame from '../../../assets/coin-game.svg';
import { IProfile } from '../../../type';
import { IconSmall } from '../atoms/wc-a-icon';
import { TextNormal } from '../atoms/wc-a-text';

interface CurrencyStatBoxProps {
  profile?: IProfile;
  className?: string;
}

/**
 * Converts a numerical amount into a more readable format by adding appropriate
 * monetary suffixes (like "K" for thousands, "M" for millions, "B" for billions, etc.).
 * It scales the number based on its size and returns it as a string formatted to
 * two decimal places along with the corresponding suffix.
 *
 * @param amount - The numerical amount to be converted.
 * @returns A string representing the amount with a monetary suffix.
 */
function convertToMonetarySuffix(amount: number): string {
  // Check if the amount is zero
  if (amount === 0) return '0';

  // Define the suffixes and the corresponding power of 1000
  const suffixes: string[] = ['', 'K', 'M', 'B', 'T'];
  const suffixIndex: number = Math.min(
    suffixes.length - 1,
    Math.max(0, Math.floor(Math.log10(Math.abs(amount)) / 3)),
  );

  // Calculate the scaled amount
  const scaledAmount: number = amount / Math.pow(1000, suffixIndex);
  // Format the number to 2 decimal places, remove trailing zeros, and append the appropriate suffix
  const formattedAmount: string = `${parseFloat(scaledAmount.toFixed(3))}${suffixes[suffixIndex]}`;
  return formattedAmount;
}

export function CurrencyStatBox({ profile, className = '' }: CurrencyStatBoxProps) {
  return (
    <div
      className={
        'flex justify-center items-center divide-x-2 divide-solid divide-secondary bg-white p-4 rounded-3xl ' +
        className
      }
    >
      <div className="flex-1 flex justify-center items-center gap-2">
        <IconSmall src={ImageCoinGame} />
        <TextNormal>
          {convertToMonetarySuffix(profile?.account?.currency.coin ?? 0)}
        </TextNormal>
      </div>
      <div className="flex-1 flex justify-center items-center gap-2">
        <IconSmall src={ImageCoinArcade} />
        <TextNormal>
          {convertToMonetarySuffix(profile?.account?.currency.key ?? 0)}
        </TextNormal>
      </div>
    </div>
  );
}

export default CurrencyStatBox;
