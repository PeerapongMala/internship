import CWInputCheckbox from '@component/web/cw-input-checkbox';
import CWModalCustom, { ModalPopupProps } from '@component/web/cw-modal/cw-modal-custom';
import { ReactNode, useState, useEffect } from 'react';

export type TModalDownloadParams<T> = {
  label: ReactNode;
  key: string;
  value: T;
};

type ModalDownloadCustomKeyProps<T> = Omit<ModalPopupProps, 'onOk'> & {
  params: TModalDownloadParams<T>[];
  onOk: (selectedOptions: TModalDownloadParams<T>[]) => void;
};

const ModalDownloadCustomKey = <T,>({
  children,
  open,
  onClose,
  title,
  params,
  onOk,
}: ModalDownloadCustomKeyProps<T>) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      setSelectedKeys([]);
      return;
    }

    setSelectedKeys(params.map((p) => p.key));
  }, [open]);

  const handleCheckboxChange = (key: string) => {
    setSelectedKeys((prevKeys) =>
      prevKeys.includes(key) ? prevKeys.filter((k) => k !== key) : [...prevKeys, key],
    );
  };

  const handleOk = () => {
    const selectedOptions = params.filter((param) => selectedKeys.includes(param.key));

    onOk(selectedOptions);
    onClose();
  };

  return (
    <CWModalCustom
      open={open}
      onClose={onClose}
      title={title}
      onOk={handleOk}
      cancelButtonName="ยกเลิก"
      buttonName={'Download'}
    >
      {children}

      {params.map((param) => (
        <div key={param.key} className="flex items-center">
          <CWInputCheckbox
            checked={selectedKeys.includes(param.key)}
            onChange={() => handleCheckboxChange(param.key)}
          />
          <span className="">{param.label}</span>
        </div>
      ))}
    </CWModalCustom>
  );
};

export default ModalDownloadCustomKey;
