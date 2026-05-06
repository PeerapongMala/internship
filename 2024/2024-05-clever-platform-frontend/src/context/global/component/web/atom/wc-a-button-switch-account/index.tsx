import ImageIconSwitchAccount from '../../../../assets/icon-switch-account.svg';
import Button from '../wc-a-button';

const ButtonSwitchAccount = ({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <div className={className}>
      <Button onClick={onClick} className="h-full w-full" variant="warning">
        <img className="h-10 w-10" src={ImageIconSwitchAccount} />
      </Button>
    </div>
  );
};

export default ButtonSwitchAccount;
