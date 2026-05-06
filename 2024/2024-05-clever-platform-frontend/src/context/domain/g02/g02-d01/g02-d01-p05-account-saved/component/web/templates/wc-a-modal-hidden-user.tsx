import { useTranslation } from 'react-i18next';

import { UserData } from '@domain/g02/g02-d01/local/type';
import ImageIconEyeOff from '@global/assets/icon-eye-off.svg';
import Button from '@global/component/web/atom/wc-a-button';
import Modal from '@global/component/web/molecule/wc-m-modal';
import { UserPersistedData } from '@store/global/persist';
import ConfigJson from '../../../config/index.json';
import SelectUser from '../molecules/wc-a-select-user';

const ModalHiddenUser = ({
  selectedUser,
  showModal,
  setShowModal,
  onOk,
}: {
  selectedUser: UserData | null;
  showModal: boolean;
  setShowModal: any;
  onOk?: any;
}) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <>
      {showModal && selectedUser ? (
        <Modal
          title={t('unsave_account')}
          setShowModal={setShowModal}
          className="h-[61%] w-[58%]"
          customBody={<Body selectedUser={selectedUser} />}
          customFooter={<Footer onOk={onOk} />}
        />
      ) : null}
    </>
  );
};

const Body = ({ selectedUser }: { selectedUser: UserPersistedData }) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <div className="flex flex-col gap-4 w-full items-center pt-7 border-b-2 border-dashed border-secondary text-3xl pb-10">
      <div className="w-full text-balance text-center">
        <span className="">{t('hide_account')}</span>{' '}
        <span className="font-semibold">{t('this_is_not_delete_account')}</span>
        <div className="pt-2">{t('you_can_add_this_account_later')}</div>
      </div>
      <SelectUser
        hiddenSwap={true}
        description={selectedUser?.last_login ? t('last_login', { date: new Date(selectedUser.last_login) }) : "-"}
        title={selectedUser.first_name + ' ' + selectedUser.last_name}
        imageSrc={selectedUser.image_url ?? ''}
        tempImageSrc={selectedUser.temp_image ?? ''}
      />
    </div>
  );
};

const Footer = ({ onOk }: { onOk?: any }) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <div className="flex justify-center items-center w-full py-5">
      <Button
        onClick={onOk}
        variant="danger"
        width="40rem"
        height="65px"
        textClassName="justify-center items-center text-[25px] pr-4"
        prefix={<img src={ImageIconEyeOff} className="h-12 w-14 pl-2 pt-1 pb-1" />}
      >
        {t('confirm_unsave_account')}
      </Button>
    </div>
  );
};

export default ModalHiddenUser;
