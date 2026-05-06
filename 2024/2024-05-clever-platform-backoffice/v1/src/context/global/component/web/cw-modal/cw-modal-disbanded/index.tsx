import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '../Modal';

interface ModalDisbandedProps extends ModalProps {
  open: boolean;
  onClose: () => void;
}

const CWModalDisbanded = ({
  open,
  onClose,
  children,
  onOk,
  ...rest
}: ModalDisbandedProps) => {
  return (
    <Modal
      className="w-[420px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title={'ปิดสังกัด'}
      {...rest}
    >
      <div className="w-full">
        <div className="flex flex-col gap-4">
          <p>
            ข้อมูลจะถูกซ่อนจากหน้านี้ถาวร และสำรองไว้ในฐานข้อมูล
            คุณไม่สามารถเรียกคืนข้อมูลที่จัดเก็บมาแสดงในหน้านี้ได้อีก
          </p>
        </div>

        <div className="mt-5 flex w-full justify-between gap-5">
          <button onClick={onClose} className="btn btn-outline-dark flex w-full gap-2">
            ยกเลิก
          </button>
          <button onClick={onClose} className="btn btn-danger flex w-full gap-2">
            จัดเก็บข้อมูลถาวร
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalDisbanded;
