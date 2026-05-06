import { CameraIcon, CameraDarkIcon, PdfIcon } from '../icons';

function UploadImage() {
  return (
    <div className="border-2 border-dashed border-[#A3A3A3] relative rounded-xl">
      <input
        type="file"
        multiple
        className="cursor-pointer relative opacity-0 w-full h-[259px] z-50"
      />
      <div className="text-center py-[72px] absolute top-0 right-0 left-0 m-auto">
        <div className="flex flex-col items-center justify-center gap-x-[12px]">
          <div className="p-2 block dark:hidden">
            <CameraIcon />
          </div>
          <div className="p-2 hidden dark:flex dark:gap-3">
            <CameraDarkIcon />
            <PdfIcon />
          </div>
          <p className="text-[#737373] text-center text-[14px] leading-[20px] dark:text-[#D7D7D7]">
            อัปโหลดไฟล์
            <br /> Resolution: 999 x 999px <br />
            format: .pdf, .jpg, .png | ขนาดไม่เกิน xx MB
          </p>
        </div>
      </div>
    </div>
  );
}

export default UploadImage;
