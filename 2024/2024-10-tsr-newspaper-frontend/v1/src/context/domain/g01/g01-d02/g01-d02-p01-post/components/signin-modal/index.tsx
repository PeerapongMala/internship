import { XIcon, SignInIcon } from "../../../local/icon/icon";

type Props = {
  isOpen: boolean; // Prop to control the modal's open state
  onClose: () => void; // Callback to close the modal
};

function SignInModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null; // Do not render the modal if not open

  return (
    <dialog
      className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-[1000] overflow-auto flex justify-center items-center"
      open
    >
      <div className="relative w-[317px] sm:w-[384px] h-[194px] rounded-[7px] bg-white flex flex-col pb-[20px] gap-[40px] items-center dark:bg-dark">
        <div className="h-[52px] w-full px-[20px] flex gap-[20px] justify-between bg-neutral-100 rounded-t-[7px] items-center dark:bg-[#414141]">
          <p className="text-[18px] leading-7 font-bold dark:text-white">
            กรุณาเข้าสู่ระบบ
          </p>
          <button onClick={onClose}>
            <XIcon />
          </button>
        </div>
        <div className="w-[278px] h-[78px] flex flex-col items-center">
          <a
            href="/sign-in"
            className="w-[249.04px] h-[38px] rounded-[6px] px-[12px] gap-[16px] bg-secondary flex items-center justify-center text-white"
          >
            <SignInIcon />
            <p className="font-bold text-[14px] leading-[20.61px] text-[#FBFBFB]">
              เข้าสู่ระบบ
            </p>
          </a>
          <div className="h-[40px] flex items-center justify-center gap-1">
            <p className="text-[14px] leading-5 dark:text-[#D7D7D7]">
              ยังไม่ได้เป็นสมาชิก?
            </p>
            <a href='/sign-up'>
              <p className="text-[14px] leading-[14px] text-secondary">สมัครสมาชิก</p>
            </a>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default SignInModal;
