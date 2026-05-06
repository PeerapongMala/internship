import { useState, useEffect } from "react";
import { Divider } from "../../../../../../components/Divider";
import IconCaretDown from "../../../../../../components/Icon/IconCaretDown";
import IconCaretsDown from "../../../../../../components/Icon/IconCaretsDown";
import { Input, Select } from "../../../../../../components/Input";
import { Modal, ModalProps } from "../../../../../../components/Modal";
import ModalNewCreate from "../ModalNewCreate";

export interface TranslateObject {
    id: string;
    value: string;
}

interface ModalTranslateProps extends ModalProps {
    openWithCallback?: { show: boolean; callback: (value: string) => void; };
}

const defaultSelect = [
    { id: '0001', value: 'จงเลือกคำตอบที่ถูกต้อง' },
    { id: '0002', value: 'จงเลือกคำตอบที่ผิด' },
    { id: '0003', value: 'จงเลือกคำตอบที่ไม่เกี่ยวข้อง' },
    { id: '0004', value: 'จงเลือกคำตอบที่เกี่ยวข้อง' },
    { id: '0005', value: 'จงเลือกคำตอบที่เป็นคำนาม' },
    { id: '0006', value: 'จงเลือกคำตอบที่เป็นคำกริยา' },
    { id: '0007', value: 'จงเลือกคำตอบที่เป็นคำวิเศษณ์' },
    { id: '0008', value: 'จงเลือกคำตอบที่เป็นคำสรรพนาม' },
    { id: '0009', value: 'จงเลือกคำตอบที่เป็นคำสรรพนามบุรุษ' },
    { id: '0010', value: 'จงเลือกคำตอบที่เป็นคำสรรพนามหญิง' },
    { id: '0011', value: 'จงเลือกคำตอบที่เป็นคำสรรพนามสรรพสามิต' },
    { id: '0012', value: 'จงเลือกคำตอบที่เป็นคำสรรพนามสรรพสามิต' },
]

const ModalTranslate = ({
    open,
    openWithCallback,
    onClose,
    children,
    ...rest
}: ModalTranslateProps) => {
    const [showModalNewCreate, setShowModalNewCreate] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>('');

    const onClickNewCreate = () => {
        setShowModalNewCreate(true);
    }

    const handleCloseModalNewCreate = () => {
        setShowModalNewCreate(false);
    }

    const handleOk = () => {
        if (openWithCallback?.callback) {
            openWithCallback.callback(selectedValue);
        }
        if (onClose) {
            onClose();
        }
    }

    if (!openWithCallback?.show) return null;

    return (
        <>
            <Modal
                className="w-3/4"
                open={openWithCallback.show}
                onClose={onClose}
                disableCancel
                disableOk
                title="เลือกข้อความ"
                {...rest}
            >
                <div className="flex flex-col gap-2">
                    <div className="flex w-full gap-2 mb-4 items-center">
                        <Select
                            className="w-1/4"
                            options={[
                                { value: 'th', label: 'ภาษาไทย' },
                                { value: 'en', label: 'ภาษาอังกฤษ' },
                                { value: 'ch', label: 'ภาษาจีน' },
                            ]}
                            defaultValue={{ value: 'th', label: 'ภาษาไทย' }}
                        />
                        <Input
                            className="w-full"
                            placeholder="คำตอบ"
                        />
                    </div>
                    <Divider />
                    <div className="overflow-y-auto h-[300px]">
                        {defaultSelect.map((item, index) => (
                            <label key={index} className="inline-flex items-center w-full gap-2">
                                <input type="radio" className="form-radio" name="translate" onChange={() => setSelectedValue(item.value)} />
                                <div className="grid grid-cols-2 form-input font-normal h-10 p-[10px] px-4 w-full">
                                    <div>ID:{item.id}</div>
                                    <div>{item.value}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <div>
                                แสดง 1 จาก 12 หน้า
                            </div>
                            <Select
                                className="w-20"
                                options={[
                                    { value: '10', label: '10' },
                                    { value: '20', label: '20' },
                                    { value: '50', label: '50' },
                                ]}
                                defaultValue={{ value: '10', label: '10' }}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="button" className="btn btn-gray w-10 h-10 p-0 rounded-full">
                                <IconCaretsDown className='rotate-90' />
                            </button>
                            <button type="button" className="btn btn-gray w-10 h-10 p-0 rounded-full">
                                <IconCaretDown className='rotate-90' />
                            </button>
                            <button type="button" className="btn btn-primary w-10 h-10 p-0 rounded-full">
                                1
                            </button>
                            <button type="button" className="btn btn-gray w-10 h-10 p-0 rounded-full">
                                2
                            </button>
                            <button type="button" className="btn btn-gray w-10 h-10 p-0 rounded-full">
                                <IconCaretDown className='-rotate-90' />
                            </button>
                            <button type="button" className="btn btn-gray w-10 h-10 p-0 rounded-full">
                                <IconCaretsDown className='-rotate-90' />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button className="btn btn-outline-primary w-44">
                            ย้อนกลับ
                        </button>
                        <div className="flex gap-2">
                            <button className="btn btn-outline-primary w-44" onClick={onClickNewCreate}>
                                สร้างใหม่
                            </button>
                            <button className="btn btn-primary w-44" onClick={handleOk}>
                                เลือก
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
            <ModalNewCreate
                open={showModalNewCreate}
                onClose={handleCloseModalNewCreate}
            />
        </>
    );
};

export default ModalTranslate;
