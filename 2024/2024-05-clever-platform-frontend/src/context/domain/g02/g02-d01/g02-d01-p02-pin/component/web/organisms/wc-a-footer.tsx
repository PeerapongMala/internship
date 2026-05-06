import { useTranslation } from 'react-i18next';

import ImageIconBackspace from '@global/assets/icon-backspace.svg';
import Button from '@global/component/web/atom/wc-a-button';
import ConfigJson from '../../../config/index.json';
import NumberPin from '../molecules/wc-a-number-pin';

const Footer = ({
  handleClickPin,
  handleDeletePin,
  handleForgotPin,
}: {
  handleClickPin: (pin: number) => void;
  handleDeletePin: () => void;
  handleForgotPin: () => void;
}) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <div className="relative flex flex-col w-full pt-2 px-6 gap-4">
      <div className="">
        <NumberPin onClick={handleClickPin} />
      </div>
      <div className="flex justify-between pl-3">
        <Button
          onClick={handleForgotPin}
          variant="warning"
          width="25.5rem"
          height="4.3rem"
        >
          {t('forgot_pin')}
        </Button>
        <Button
          onClick={handleDeletePin}
          variant="warning"
          size="circle"
          width="68px"
          height="68px"
        >
          <img src={ImageIconBackspace} alt="backspace" className="h-10 w-10" />
        </Button>
      </div>
    </div>
  );
};

export default Footer;
