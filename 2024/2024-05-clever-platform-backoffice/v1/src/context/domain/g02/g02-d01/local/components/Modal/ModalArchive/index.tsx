import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';

interface ModalArchiveProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  content?: string;
  onOk?: () => void;
}

const ModalArchive = ({
  open,
  onClose,
  children,
  onOk,
  title,
  content,
  ...rest
}: ModalArchiveProps) => {
  return (
    <Modal
      className="h-[220px] w-[450px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title={title}
      {...rest}
    >
      <div className="w-full">
        <div className="flex flex-col gap-4">{content}</div>

        <div className="flex w-full justify-between gap-5 px-5 py-5">
          <button onClick={onClose} className="btn btn-outline-dark flex w-full gap-2">
            ยกเลิก
          </button>
          <button className="btn btn-danger flex w-full gap-2" onClick={onOk}>
            ยืนยัน
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalArchive;
