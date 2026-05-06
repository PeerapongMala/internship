interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm }: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-center">
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose} />
      <div className="relative w-full max-w-[384px] h-[52px] bg-[#F5F5F5] dark:bg-[#414141] shadow-lg rounded-t-md mx-2">
        <div className="flex items-center justify-between py-3 px-5">
          <h3 className="text-[#171717] font-bold text-[18px] leading-7 dark:text-white">
            ยกเลิกการอนุมัติ
          </h3>
          <button
            onClick={onClose}
            className="text-[#525252] hover:text-gray-900 dark:hover:text-white rounded-lg h-5 w-5 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
        <div className="p-5 bg-white dark:bg-[#262626]">
          <p className="text-sm font-normal text-[#0E1726] dark:text-[#D7D7D7]">
            คุณแน่ใจแล้วใช่ไหมที่จะยกเลิกการอนุมัติเอกสารนี้
          </p>
        </div>
        <div className="bg-white dark:bg-[#262626] px-5 rounded-b-md flex justify-center gap-3 pb-5">
          <button
            onClick={onClose}
            className="font-bold py-2 w-full text-sm text-[#171717] bg-white border border-[#D4D4D4] dark:border-[#414141] dark:bg-[#737373] dark:text-white rounded-[4px] hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="font-bold py-2 w-full text-center text-sm text-white bg-[#D83636] hover:bg-[#C42626] hover:shadow-lg border-none rounded-[6px] transition-all duration-200 ease-in-out"
          >
            ฉันแน่ใจ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
