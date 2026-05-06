interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onDownload: () => void;
  onConfirm: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onDownload,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full m-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">ตัวอย่างปกหนังสือพิมพ์</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Close</span>
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Image Preview */}
        <div className="overflow-auto max-h-[70vh]">
          <img src={imageUrl} alt="Preview" className="w-full h-auto max-w-full" />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-[#D9A84E] text-white rounded-md hover:bg-[#c69746] transition-colors"
          >
            ดาวน์โหลด
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            ยืนยันการบันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
