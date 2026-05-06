import { useTranslation } from 'react-i18next';

import ModalBackgroudA from '@global/component/web/organism/wc-o-modal-backgroud-a';
import ConfigJson from '../../../config/index.json';
import Body from '../organisms/wc-a-body';
import Footer from '../organisms/wc-a-footer';
import Header from '../organisms/wc-a-header';
import { UserData } from '@domain/g02/g02-d01/local/type';

const ContainerRight = ({
  offLineMode,
  handleToggleInternet,
  selectedUser,
  handleClickSwap,
  handleClickStart,
}: {
  offLineMode: boolean;
  handleToggleInternet: any;
  selectedUser: UserData;
  handleClickSwap: any;
  handleClickStart: any;
}) => {
  const { t } = useTranslation([ConfigJson.key]);

  return (
    <div className="flex flex-col h-full w-full">
      <ModalBackgroudA />
      <Header title={t('login')} />
      <Body
        offLineMode={offLineMode}
        handleToggleInternet={handleToggleInternet}
        selectedUser={selectedUser}
        handleClickSwap={handleClickSwap}
      />
      <Footer handleClickStart={handleClickStart} title={t('start')} />
    </div>
  );
};

export default ContainerRight;
