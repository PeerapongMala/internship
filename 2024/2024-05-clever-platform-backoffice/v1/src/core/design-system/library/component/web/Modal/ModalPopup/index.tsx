import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '../Modal';
import Button from '../../Button';

interface ModalPopupProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'white'
    | 'dark';
  buttonName?: string;
}

const ModalPopup = ({
  open,
  onClose,
  children,
  onOk,
  title,
  message,
  variant,
  buttonName,
  ...rest
}: ModalPopupProps) => {
  return (
    <Modal
      className="w-[400px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title={title}
      {...rest}
    >
      <div className="w-full">
        <div className="flex flex-col gap-4">
          <p> {message} </p>
        </div>

        <div className="mt-5 flex w-full justify-between gap-5">
          <Button
            variant={variant}
            title={buttonName}
            onClick={onClose}
            className="w-full"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalPopup;
