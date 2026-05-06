import ImageIconEyeOff from '../../../../assets/icon-eye-off.svg';
import Button from '../wc-a-button';

const ButtonEyeOff = ({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <div className={className}>
      <Button onClick={onClick} className="h-full w-full" variant="warning">
        <img className="h-10 w-10" src={ImageIconEyeOff} />
      </Button>
    </div>
  );
};

export default ButtonEyeOff;
