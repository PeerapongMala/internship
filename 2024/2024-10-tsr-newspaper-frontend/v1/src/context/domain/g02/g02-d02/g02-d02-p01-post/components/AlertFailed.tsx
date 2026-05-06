import { XIcon } from './Icons';

type Props = {
  onClose?: () => void;
};

function AlertFailed({ onClose }: Props) {
  return (
    <dialog className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-[1000] overflow-auto flex justify-center items-center">
      <div className="relative w-[317px] sm:w-[384px] rounded-[7px] bg-white flex flex-col pb-[20px] dark:bg-dark">
        <div className="h-[52px] w-full px-[20px] flex justify-between bg-neutral-100 rounded-t-[7px] items-center dark:bg-[#414141]">
          <p className="text-[18px] leading-7 font-bold dark:text-white">
            การอัปโหลดไม่สำเร็จ
          </p>
          <button onClick={onClose}>
            <XIcon />
          </button>
        </div>
        <div className="p-[20px]">
          <p className="text-[14px] leading-[20px] dark:text-white">
            ไฟล์ของคุณมีขนาดใหญ่เกินไป (กรุณาอัปโหลดใหม่)
          </p>
        </div>
      </div>
    </dialog>
  );
}

export default AlertFailed;
