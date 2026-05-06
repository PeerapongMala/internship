import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';

interface ModalDownloadProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
}

const ModalDownload = ({
  open,
  onClose,
  children,
  onOk,
  title,
  ...rest
}: ModalDownloadProps) => {
  return (
    <Modal
      className="h-[320px] w-[400px]"
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
            <IconDownload /> Download
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDownload;
