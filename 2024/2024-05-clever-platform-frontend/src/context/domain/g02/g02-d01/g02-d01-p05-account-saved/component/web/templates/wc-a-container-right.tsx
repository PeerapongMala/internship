import { useTranslation } from 'react-i18next';

import { UserData } from '@domain/g02/g02-d01/local/type';
import ModalBackgroudA from '@global/component/web/organism/wc-o-modal-backgroud-a';
import ConfigJson from '../../../config/index.json';
import Body from '../organisms/wc-a-body';
import Footer from '../organisms/wc-a-footer';
import Header from '../organisms/wc-a-header';

const ContainerRight = ({
  userList,
  handleClickHiddenUser,
  handleClickAddUser,
  handleSelectUser,
  handleClickBack,
}: {
  userList: UserData[];
  handleClickHiddenUser: (student_id: string) => void;
  handleClickAddUser: () => void;
  handleSelectUser: (student_id: string) => void;
  handleClickBack: () => void;
}) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  return (
    <div className="flex flex-col h-full w-full">
      <ModalBackgroudA />
      <Header handleClickBack={handleClickBack} />
      <Body
        handleClickHiddenUser={handleClickHiddenUser}
        userList={userList}
        handleSelectUser={handleSelectUser}
      />
      <Footer handleClickAddUser={handleClickAddUser} title={t('add_account')} />
    </div>
  );
};

export default ContainerRight;
