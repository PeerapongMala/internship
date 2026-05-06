import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '../Modal';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';

interface ModalUploadProps extends ModalProps {
  open: boolean;
  onClose: () => void;
}

const CWModalUpload = ({ open, onClose, children, onOk, ...rest }: ModalUploadProps) => {
  return (
    <Modal
      className="h-[320px] w-[400px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title={'นำเข้าข้อมูล'}
      {...rest}
    >
      <div className="w-full">
        <div className="flex flex-col gap-4">
          <div className="space-y-0.5">
            <label htmlFor="from-export-datetime-input" className="font-normal">
              ตั้งแต่วันที่:
            </label>
            <input
              type="date"
              className="form-input !font-normal"
              placeholder="วว/ดด/ปปปป"
              id="from-export-datetime-input"
            />
          </div>

          <div className="space-y-0.5">
            <label htmlFor="to-export-datetime-input" className="font-normal">
              ถึงวันที่:
            </label>
            <input
              type="date"
              className="form-input !font-normal"
              id="to-export-datetime-input"
            />
          </div>
        </div>

        <div className="flex w-full justify-between gap-5 px-5 py-5">
          <button onClick={onClose} className="btn btn-outline-dark flex w-full gap-2">
            ยกเลิก
          </button>
          <button className="btn btn-primary flex w-full gap-1">
            <IconUpload /> Upload
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalUpload;
