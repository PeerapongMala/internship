import { useTranslation } from 'react-i18next';

import NumberPin from '@domain/g02/g02-d01/g02-d01-p02-pin/component/web/molecules/wc-a-number-pin';
import ImageIconBackspace from '@global/assets/icon-backspace.svg';
import Button from '@global/component/web/atom/wc-a-button';
import ConfigJson from '../../../config/index.json';

const PINFooter = ({
  handleClickPin,
  handleDeletePin,
  handleConfirmPin,
}: {
  handleClickPin: (pin: number) => void;
  handleDeletePin: () => void;
  handleConfirmPin: () => void;
}) => {
  const { t } = useTranslation([ConfigJson.key]);

  return (
    <div className="relative flex flex-col w-full py-4 px-6 gap-4">
      <div className="">
        <NumberPin onClick={handleClickPin} />
      </div>
      <div className="flex justify-around pl-3 gap-3">
        <Button
          onClick={handleConfirmPin}
          variant="success"
          width="22rem"
          height="4.5rem"
        >
          {t('confirm')}
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

export default PINFooter;
