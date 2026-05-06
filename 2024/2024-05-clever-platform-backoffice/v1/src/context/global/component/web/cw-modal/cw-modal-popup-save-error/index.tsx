import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '../Modal';
import Button from '../../cw-button';
import ModalPopup from '../cw-modal-popup';

interface ModalPopupSaveErrorProps {
  open: boolean;
  onClose: () => void;
}

const CWModalPopupSaveError = ({ open, onClose }: ModalPopupSaveErrorProps) => {
  return (
    <ModalPopup
      open={open}
      onClose={onClose}
      title="บันทึกไม่สำเร็จ"
      message="โปรดลองใหม่อีกครั้ง"
      variant="danger"
      buttonName="ตกลง"
    />
  );
};

export default CWModalPopupSaveError;
