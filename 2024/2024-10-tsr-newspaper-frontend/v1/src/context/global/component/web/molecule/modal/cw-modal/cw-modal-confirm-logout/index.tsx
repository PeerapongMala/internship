import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '../index';

interface ModalLogout extends ModalProps {
    open: boolean;
    onClose: () => void;
    onOk: () => void;
}

const CWModalConfirmLogout = ({
    open,
    onClose,
    children,
    onOk,
    ...rest
}: ModalLogout) => {
    const handleConfirm = () => {
        onOk();
        onClose();
    };

    return (
        <Modal
            className="w-[450px] h-auto"
            open={open}
            onClose={onClose}
            onOk={onOk}
            disableCancel
            disableOk
            title="ยืนยันการออกจากระบบ"
            {...rest}
        >
            <div className="w-full">
                <div className="flex flex-col gap-4 ">คุณต้องการที่จะออกจากระบบหรือไม่</div>

                <div className="w-full flex justify-between gap-5 mt-5">

                    <button
                        onClick={onClose}
                        className="w-full border dark:bg-white border-neutral-400 rounded-[6px] text-[14px] leading-[14px] font-semibold py-[12px] text-black disabled:opacity-50 flex items-center justify-center"
                    >
                        ยกเลิก
                    </button>
                    <button
                        className="w-full bg-[#D83636] rounded-[6px] text-[14px] leading-[14px] font-semibold py-[12px] text-white disabled:opacity-50 flex items-center justify-center"
                        onClick={handleConfirm}
                    >
                        ออกจากระบบ
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CWModalConfirmLogout;
