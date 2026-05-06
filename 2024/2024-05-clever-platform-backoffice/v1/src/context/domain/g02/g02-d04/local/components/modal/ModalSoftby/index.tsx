import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';

import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';

interface ModalSortByProps extends ModalProps {
  open: boolean;
  onClose: () => void;
}

const ModalSortBy = ({ open, onClose, children, onOk, ...rest }: ModalSortByProps) => {
  const numbertest = 10;
  return (
    <Modal
      className="h-[400px] w-[400px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="เรียงลำดับบทเรียนหลัก"
      {...rest}
    >
      <div className="w-full">
        <div></div>
        <div className="px- flex w-full justify-between gap-5 py-5">
          <button onClick={onClose} className="btn btn-outline-primary flex w-full gap-2">
            ยกเลิก
          </button>
          <button className="btn btn-primary flex w-full gap-2">เลือก</button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSortBy;
