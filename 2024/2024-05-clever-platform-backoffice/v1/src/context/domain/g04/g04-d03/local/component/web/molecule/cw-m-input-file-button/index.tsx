import CWButton from '@component/web/cw-button';
import { useEffect, useRef, useState } from 'react';

interface CWMInputFileButtonProps {
  label: string;
  size?: number;
  accept?: string;
  onFileChange?: (file?: File) => void;
}

const CWMInputFileButton: React.FC<CWMInputFileButtonProps> = function (props) {
  const fileEl = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();

  useEffect(() => {
    props.onFileChange?.(file);
  }, [file]);

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = function (e) {
    if (e.currentTarget.files) setFile(e.currentTarget.files[0]);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        className="hidden"
        size={props.size}
        accept={props.accept}
        ref={fileEl}
        onChange={onFileChange}
      />
      <CWButton
        outline
        className="!px-10"
        title={props.label}
        onClick={() => fileEl.current?.click()}
      />
      {file?.name}
    </div>
  );
};

export default CWMInputFileButton;
