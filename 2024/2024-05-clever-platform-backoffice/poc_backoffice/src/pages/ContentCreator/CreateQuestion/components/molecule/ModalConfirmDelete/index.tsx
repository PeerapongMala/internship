import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";

interface ModalConfirmDeleteProps {
    isOpen: boolean;
    onClose: () => void;
    onOk: () => void;
}

const ModalConfirmDelete = ({ isOpen, onClose, onOk }: ModalConfirmDeleteProps) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="คุณต้องการลบใช่ไหม ?"
            // onOk={onOk}
            disableCancel
            disableOk
            className="w-[26rem] h-[18rem]"
        >
            <div className="flex flex-col justify-around h-full">
                <Input
                    className="w-full"
                    placeholder="กรอกรหัสผ่าน"
                />
                <div className="flex justify-end gap-4">
                    <button className="btn btn-primary w-full text-lg" onClick={onClose}>
                        ยกเลิก
                    </button>
                    <button className="btn btn-danger w-full text-lg" onClick={onOk}>
                        ลบ
                    </button>
                </div>
            </div>

        </Modal>
    );
};

export default ModalConfirmDelete;
