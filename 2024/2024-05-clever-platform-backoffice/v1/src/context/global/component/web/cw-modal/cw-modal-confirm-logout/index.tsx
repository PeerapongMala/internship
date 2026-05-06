import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '../Modal';

interface ModalLogout extends ModalProps {
  open: boolean;
  onClose: () => void;
  onOk: () => void;
}

const CWModalConfirmLogout = ({
  open,
  onClose,
  children,
  onOk,
  ...rest
}: ModalLogout) => {
  const handleConfirm = () => {
    onOk();
    onClose();
  };

  return (
    <Modal
      className="h-auto w-[450px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="ยืนยันการออกจากระบบ"
      {...rest}
    >
      <div className="w-full">
        <div className="flex flex-col gap-4">คุณต้องการที่จะออกจากระบบหรือไม่</div>

        <div className="mt-5 flex w-full justify-between gap-5">
          <button onClick={onClose} className="btn btn-outline-dark flex w-full gap-2">
            ยกเลิก
          </button>
          <button className="btn btn-danger flex w-full gap-2" onClick={handleConfirm}>
            ใช่
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalConfirmLogout;
