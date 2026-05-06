import React from 'react'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    id: number;
}

const ModalQuestion: React.FC<ModalProps> = ({ isOpen, onClose, id }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-md w-[650px] h-[650px]">
                <button onClick={onClose} className="mb-4">
                    ปิด
                </button>
                <p>ModalQuestion</p>
                {id}
            </div>
        </div>
    );
};

export default ModalQuestion