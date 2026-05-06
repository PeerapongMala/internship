import { useRouter } from '@tanstack/react-router';
import ImageIconArrowLeft from '../../../../assets/icon-arrow-left.svg';
import Button, { IButtonProps } from '../wc-a-button';

interface IButtonBackProps extends Omit<IButtonProps, 'variant' | 'children'> {
  href?: string;
  buttonClassName?: string;
  onClick?: () => void;
}

const ButtonBack = ({
  href,
  className,
  buttonClassName,
  onClick,
  ...buttonProps
}: IButtonBackProps) => {
  const router = useRouter();
  const handleOnBack = () => {
    // enable view transition for next routing
    // fix: router.shouldViewTransition doesn't have this property on AnyRouter, removing it
    // router.shouldViewTransition = true;

    // priority onClick prop first
    if (onClick) {
      return onClick();
    }
    // if not passing onClick prop, try to navigate to href or going back
    if (href) {
      return router.history.push(href);
    }
    // else go back
    return router.history.back();
  };
  return (
    <div className={className}>
      <Button
        {...buttonProps}
        className={`h-full w-full ${buttonClassName}`}
        variant="warning"
        onClick={handleOnBack}
      >
        <img className="h-10 w-10" src={ImageIconArrowLeft} />
      </Button>
    </div>
  );
};

export default ButtonBack;
