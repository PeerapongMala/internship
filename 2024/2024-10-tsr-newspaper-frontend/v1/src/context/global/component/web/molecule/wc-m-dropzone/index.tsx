import { useRef } from 'react';
import { CameraDarkIcon, CameraIcon, PdfIcon, PdfIconDark } from './Icons';

interface DropZoneProps {
  isDisable: boolean;
  dndRef: React.RefObject<HTMLDivElement>;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e?: React.DragEvent<HTMLDivElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resolution?: string;
}

const DropZone: React.FC<DropZoneProps> = ({
  isDisable,
  dndRef,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileChange,
  resolution = 'ไม่ระบุ',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      ref={dndRef}
      className={`relative flex flex-col border-[#A3A3A3] h-[259px] border-2 border-dashed rounded-xl ${
        isDisable ? '' : 'cursor-pointer'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <input
        ref={fileInputRef}
        disabled={isDisable}
        accept="image/*"
        type="file"
        multiple
        className={`absolute inset-0 z-50 w-full h-[259px] p-0 m-0 outline-none opacity-0 ${
          isDisable ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
        onChange={(e) => {
          onFileChange(e);
          resetFileInput();
        }}
      />
      <div className="h-inherit flex flex-col items-center justify-center py-10 text-center">
        <div className="p-2 dark:hidden flex gap-3">
          <CameraIcon />
          <span className="md:hidden">
            <PdfIcon />
          </span>
        </div>
        <div className="p-2 hidden dark:flex dark:gap-3">
          <CameraDarkIcon />
          <span className="md:hidden">
            <PdfIconDark />
          </span>
        </div>
        <p className="text-[#737373] text-center text-[14px] leading-[20px] dark:text-[#D7D7D7]">
          อัปโหลดไฟล์
          <br /> Resolution: {resolution}  <br />
          format: .pdf, .jpg, .png 
        </p>
      </div>
    </div>
  );
};

export default DropZone;
