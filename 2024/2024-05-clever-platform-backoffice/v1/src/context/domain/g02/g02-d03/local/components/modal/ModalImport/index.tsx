import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';

interface ModalImportProps extends ModalProps {
  open: boolean;
  onClose: () => void;
}

const ModalImport = ({ open, onClose, children, onOk, ...rest }: ModalImportProps) => {
  return (
    <Modal
      className="h-[220px] w-[450px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="จัดเก็บถาวร"
      {...rest}
    >
      <div className="w-full">
        <div className="flex flex-col gap-4">
          ข้อมูลจะถูกซ่อนจากหน้านี้ถาวร และสำรองไว้ในฐานข้อมูล
          คุณไม่สามารถเรียกคืนข้อมูลที่จัดเก็บมาแสดงในหน้านี้ได้อีก
        </div>

        <div className="flex w-full justify-between gap-5 px-5 py-5">
          <button onClick={onClose} className="btn btn-outline-primary flex w-full gap-2">
            ยกเลิก
          </button>
          <button className="btn btn-danger flex w-full gap-2">จัดเก็บข้อมูล</button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalImport;
