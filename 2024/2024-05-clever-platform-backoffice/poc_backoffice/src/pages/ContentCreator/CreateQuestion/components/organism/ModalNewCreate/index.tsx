import IconVolumeLoud from "@/components/Icon/IconVolumeLoud";
import { Divider } from "../../../../../../components/Divider";
import IconCaretDown from "../../../../../../components/Icon/IconCaretDown";
import IconCaretsDown from "../../../../../../components/Icon/IconCaretsDown";
import IconPlus from "../../../../../../components/Icon/IconPlus";
import { Input, Select } from "../../../../../../components/Input";
import { Modal, ModalProps } from "../../../../../../components/Modal";
import { ReactNode } from "react";

interface ModalNewCreateProps extends ModalProps {

}

const ModalNewCreate = ({
    open,
    onClose,
    children,
    onOk,
    ...rest
}: ModalNewCreateProps) => {
    return (
        <Modal
            className="w-3/4 h-[35rem]"
            open={open}
            onClose={onClose}
            onOk={onOk}
            disableCancel
            disableOk
            title="สร้างข้อความใหม่"
            {...rest}
        >
            <div className="flex flex-col gap-2">
                <div className="flex w-full gap-2 mb-4 items-center">
                    <div className="w-1/4">รหัสข้อความ:</div>
                    <div className="w-full">000001</div>
                </div>
                <div className="flex w-full gap-2 mb-4 items-center justify-between">
                    <div className="flex w-full items-center">
                        <div className="w-1/4">แปลข้อความด้วย AI จาก:</div>
                        <Select
                            className="w-1/4"
                            options={[
                                { value: 'th', label: 'ภาษาไทย' },
                                { value: 'en', label: 'ภาษาอังกฤษ' },
                                { value: 'ch', label: 'ภาษาจีน' },
                            ]}
                            defaultValue={{ value: 'th', label: 'ภาษาไทย' }}
                        />
                    </div>
                    <button className="btn btn-outline-primary w-44">
                        แปลข้อความ
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <label className="inline-flex items-center w-full gap-2">
                        <input type="checkbox" className="form-checkbox" />
                        <Input
                            required
                            label="ข้อความภาษาไทย"
                            className="w-full"
                            placeholder="คำตอบ"
                        />
                    </label>
                    <ComponentSound isSound={true} />
                </div>
                <div className="flex items-center gap-2">
                    <label className="inline-flex items-center w-full gap-2">
                        <input type="checkbox" className="form-checkbox" />
                        <Input
                            required
                            label="ข้อความภาษาอังกฤษ"
                            className="w-full"
                            placeholder="คำตอบ"
                        />
                    </label>
                    <ComponentSound isSound={false} />
                </div>
                <div className="flex items-center gap-2">
                    <label className="inline-flex items-center w-full gap-2">
                        <input type="checkbox" className="form-checkbox" />
                        <Input
                            required
                            label="ข้อความภาษาจีน"
                            className="w-full"
                            placeholder="คำตอบ"
                        />
                    </label>
                    <ComponentSound isSound={false} />
                </div>

                <div className="flex justify-between items-center mt-4">
                    <button className="btn btn-outline-primary w-44" onClick={onClose}>
                        ย้อนกลับ
                    </button>
                    <div className="flex gap-2">
                        <button className="btn btn-primary w-44">
                            <IconPlus />
                            สร้างใหม่
                        </button>
                    </div>
                </div>

            </div>


        </Modal>

    );
};

const ComponentSound = ({ isSound }: { isSound: boolean }) => {

    if (!isSound) {
        return (
            <div className='flex gap-4 items-center'>
                <div className='w-4 h-4 bg-danger rounded-full' />
                <button type="button" className="btn btn-primary w-10 h-10 p-0 rounded-full">
                    <IconPlus />
                </button>
            </div>
        );
    }

    return (
        <div className='flex gap-4 items-center'>
            <div className='w-4 h-4 bg-success rounded-full' />
            <button type="button" className="btn btn-primary w-10 h-10 p-0 rounded-full">
                <IconVolumeLoud className="w-5 h-5" />
            </button>
        </div>
    );
}

export default ModalNewCreate;
