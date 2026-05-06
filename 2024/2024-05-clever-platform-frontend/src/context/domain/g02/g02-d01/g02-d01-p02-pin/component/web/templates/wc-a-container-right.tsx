import { useTranslation } from 'react-i18next';

import ModalBackgroudA from '@global/component/web/organism/wc-o-modal-backgroud-a';
import ConfigJson from '../../../config/index.json';
import Body from '../organisms/wc-a-body';
import Footer from '../organisms/wc-a-footer';
import Header from '../organisms/wc-a-header';
import { UserData } from '@domain/g02/g02-d01/local/type';

const ContainerRight = ({
  pin,
  currentUser,
  handleClickPin,
  handleDeletePin,
  handleClickSwap,
  handleClickBack,
  handleForgotPin,
  warningText,
}: {
  pin: string;
  currentUser: UserData;
  handleClickPin: (pin: number) => void;
  handleDeletePin: () => void;
  handleClickSwap: () => void;
  handleClickBack: () => void;
  handleForgotPin: () => void;
  warningText: string;
}) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <div className="relative h-full w-full">
      <ModalBackgroudA />
      <Header handleClickBack={handleClickBack} title={t('login')} />
      <Body
        pin={pin}
        handleClickSwap={handleClickSwap}
        currentUser={currentUser}
        warningText={warningText}
      />
      <Footer
        handleClickPin={handleClickPin}
        handleDeletePin={handleDeletePin}
        handleForgotPin={handleForgotPin}
      />
    </div>
  );
};

export default ContainerRight;
