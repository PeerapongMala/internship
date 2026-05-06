import React from 'react'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;

}

const ModalCheckpoint: React.FC<ModalProps> = ({ isOpen, onClose}) => {
  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-md w-[650px] h-[650px]">
              <button onClick={onClose} className="mb-4">
                  ปิด
              </button>
              <p>test</p>

          </div>
      </div>
  );
};

export default ModalCheckpoint