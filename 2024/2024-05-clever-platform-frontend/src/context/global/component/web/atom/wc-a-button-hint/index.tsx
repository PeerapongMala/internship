import ImageIconBulb from '../../../../assets/icon-bulb.svg';
import Button, { IButtonProps } from '../wc-a-button';

interface IButtonHintProps extends Omit<IButtonProps, 'variant' | 'width'> {
  children?: string;
  className?: string;
  onClick?: () => void;
}

const ButtonHint = ({ className = '', onClick, ...props }: IButtonHintProps) => {
  return (
    <Button
      className={`rounded-none rounded-tr-[33px] rounded-bl-[33px] ${className}`}
      onClick={onClick}
      variant="tertiary"
      width="65px"
      height="65px"
      soundKey="game_hit"
      {...props}
    >
      <img
        src={ImageIconBulb}
        className="inline-block w-[34px] h-[34px] my-[6px] pt-[2px]"
      />
    </Button>
  );
};

export default ButtonHint;
