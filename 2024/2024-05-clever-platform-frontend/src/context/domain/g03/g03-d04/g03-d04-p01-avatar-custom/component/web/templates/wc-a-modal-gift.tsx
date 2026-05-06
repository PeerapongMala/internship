import { useTranslation } from 'react-i18next';

import APICustomAvatar from '@domain/g03/g03-d04/local/api';
import Button from '@global/component/web/atom/wc-a-button';
import Modal from '@global/component/web/molecule/wc-m-modal-shop';
import ConfigJson from '../../../config/index.json';

const ModalGift = ({
  showModal,
  setShowModal,
  selectedGift,
  handleUseItem,
  onOk,
  couponData,
  selected,
}: {
  showModal: boolean;
  selected: any;
  couponData: any;
  setShowModal: any;
  selectedGift: any;
  handleUseItem: any;
  onOk: any;
}) => {
  return (
    <>
      {showModal ? (
        <Modal
          showModal={showModal}
          title={selectedGift.name}
          setShowModal={setShowModal}
          selected={selectedGift}
          onOk={handleUseItem}
          customBody={<BodyTextModal selected={selectedGift} />}
          customFooter={
            <FooterModal
              onOk={handleUseItem}
              selectedGift={selectedGift}
              setShowModal={setShowModal}
            />
          }
          couponData={couponData}
        />
      ) : null}
    </>
  );
};

const BodyTextModal = ({ selected }: { selected: any }) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <div className="flex flex-col h-full justify-between pb-6">
      <div>{selected ? selected.description : 'Name'}</div>
      <div className="font-semibold">
        {t('amount')}: x{selected ? selected.amount : '0'}
      </div>
    </div>
  );
};

const FooterModal = ({
  selectedGift,
  onOk,
  setShowModal,
}: {
  selectedGift: any;
  onOk: any;
  setShowModal: any;
}) => {
  const { t } = useTranslation([ConfigJson.key]);

  return (
    <div className="flex justify-center h-20 mb-6">
      <Button
        onClick={() => {
          onOk(); // Call the onOk function
          APICustomAvatar.Coupon.UseCoupon.Post(selectedGift.item_id); // Call the UseCoupon API
          setShowModal(false);
        }}
        size="large"
      >
        {t('use_item')}
      </Button>
    </div>
  );
};

export default ModalGift;
