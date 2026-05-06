import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '../Modal';
import Button from '../../Button';
import ModalPopup from '../ModalPopup';

interface ModalPopupSaveErrorProps {
  open: boolean;
  onClose: () => void;
}

const ModalPopupSaveError = ({ open, onClose }: ModalPopupSaveErrorProps) => {
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

export default ModalPopupSaveError;
