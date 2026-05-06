import { Modal } from '@core/design-system/library/vristo/source/components/Modal';
import React from 'react';

interface ModalConfirmPublicProps {
  isOpen: boolean;
  onClose: () => void;
  onOk: () => void;
  children?: React.ReactNode;
}

const ModalConfirmPublic = ({
  isOpen,
  onClose,
  onOk,
  children,
}: ModalConfirmPublicProps) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="คุณต้องการเปลี่ยนสถานะเป็นเผยแพร่ใช่หรือไม่"
      // onOk={onOk}
      disableCancel
      disableOk
      className="w-[26rem]"
    >
      <div className="flex h-full flex-col justify-around gap-4">
        {children}
        <div className="flex justify-end gap-4">
          <button className="btn btn-outline-primary w-full text-lg" onClick={onClose}>
            ยกเลิก
          </button>
          <button className="btn btn-danger w-full text-lg" onClick={onOk}>
            ยืนยัน
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmPublic;
