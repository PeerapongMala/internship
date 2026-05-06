import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '../Modal';
import Button from '../../Button';
import ModalPopup from '../ModalPopup';

interface ModalPopupSaveCompleteProps {
  open: boolean;
  onClose: () => void;
}

const ModalPopupSaveComplete = ({ open, onClose }: ModalPopupSaveCompleteProps) => {
  return (
    <ModalPopup
      open={open}
      onClose={onClose}
      title="บันทึกสำเร็จ"
      message="บันทึกข้อมูลสำเร็จ"
      variant="primary"
      buttonName="ปิด"
    />
  );
};

export default ModalPopupSaveComplete;
