import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '../Modal';
import Button from '../../cw-button';
import ModalPopup from '../cw-modal-popup';

interface ModalPopupSaveCompleteProps {
  open: boolean;
  onClose: () => void;
}

const CWModalPopupSaveComplete = ({ open, onClose }: ModalPopupSaveCompleteProps) => {
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

export default CWModalPopupSaveComplete;
