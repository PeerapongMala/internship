import CWButton from '@component/web/cw-button';
import showMessage from '@global/utils/showMessage';
import { useEffect, useRef, useState } from 'react';

interface CWMInputFileButtonProps {
  label: string;
  size?: number;
  accept?: string;
  file?: File | string | null;
  onFileChange?: (file?: File) => void;
  preview?: boolean;
}

const CWMInputFileButton: React.FC<CWMInputFileButtonProps> = function ({
  size = 4,
  ...props
}) {
  const fileEl = useRef<HTMLInputElement>(null);

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = function (e) {
    const file = e.currentTarget.files?.[0];

    if (file) {
      if (file.size > size * 1024 * 1024) {
        showMessage(`กรุณาอัปโหลดรูปภาพไม่เกิน ${size}MB`, 'warning');
      } else {
        props.onFileChange?.(file);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <input
          type="file"
          className="hidden"
          size={size}
          accept={props.accept}
          ref={fileEl}
          onChange={onFileChange}
        />
        <CWButton
          type="button"
          outline
          className="!px-10"
          title={props.label}
          onClick={() => fileEl.current?.click()}
        />
        {props.file instanceof File ? props.file?.name : ''}
      </div>
      {(props.preview ?? true) && props.file && (
        <img
          src={
            props.file &&
            (typeof props.file == 'string' ? props.file : URL.createObjectURL(props.file))
          }
          alt=""
          className="size-32"
        />
      )}
    </div>
  );
};

export default CWMInputFileButton;
