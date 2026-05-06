import { useState } from "react";
import { Divider } from "../../../../../../components/Divider";
import IconTrashLines from "../../../../../../components/Icon/IconTrashLines";
import { Checkbox, Input } from "../../../../../../components/Input";
import { Modal } from "../../../../../../components/Modal";
import InputSorting from "../../../components/atom/InputSorting";

const FormSorting = () => {
    const [open, setOpen] = useState(false);
    return (
        <div className='flex flex-col gap-2'>
            <ModalSorting
                open={open}
                onClose={() => setOpen(false)}
                onOk={() => setOpen(false)}
            />
            <div className="flex flex-col gap-4 justify-center">
                <div className="font-bold">
                    เรียงลำดับกล่องคำตอบ
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-12">#1</div>
                        <div className="w-72">
                            <InputSorting label="คำตอบที่ 1: a" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-12">#2</div>
                        <div className="w-72">
                            <InputSorting label="คำตอบที่#2: cat" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-12">#3</div>
                        <div className="w-72">
                            <InputSorting label="คำตอบที่#3: and" />
                        </div>
                    </div>
                </div>
                <Divider />
            </div>
            <Input
                required
                label='คำอธิบายเมื่อคำตอบถูก'
                placeholder="คำตอบถูกต้อง"
            />
            <Input
                required
                label='คำอธิบายเมื่อคำตอบผิด (ถ้ามี)'
                placeholder="คำตอบผิด"
            />
        </div>
    )
};

const ModalSorting = ({ open, onClose, onOk }:
    { open: boolean, onClose: () => void, onOk: () => void }
) => {
    return (
        <Modal
            className="w-3/4 h-[26rem]"
            open={open}
            onClose={onClose}
            onOk={onOk}
            disableCancel
            disableOk
            title="เลือกคำตอบ"
        >
            <div className="flex flex-col gap-2">
                <label className="inline-flex items-center w-full gap-2">
                    <input type="checkbox" className="form-checkbox" defaultChecked />
                    <Input
                        className="w-full"
                        placeholder="คำตอบ"
                    />
                </label>
            </div>
        </Modal>
    )
}

export default FormSorting;
