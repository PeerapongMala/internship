import { FormAnswerSelectProps } from ".";
import { Divider } from "../../../../../../components/Divider";
import { Input, Select } from "../../../../../../components/Input";

const FormPairing = ({
    optionGroupCount,
    handleChangeOptions,
    handleShowModalTranslate,
}: FormAnswerSelectProps) => {
    const optionPatternSelect = [
        { value: 'text', label: 'ข้อความ' },
        { value: 'picture', label: 'รูปภาพ' },
        { value: 'sound', label: 'เสียง' },
    ]
    const optionCorrectSelect = [
        { value: '2', label: '2 ตัวเลือก' },
        { value: '3', label: '3 ตัวเลือก' },
        { value: '4', label: '4 ตัวเลือก' },
    ]
    const optionDuplicateSelect = [
        { value: true, label: 'ใช้ซ้ำได้' },
        { value: false, label: 'ใช้ซ้ำไม่ได้' },
    ]
    return (
        <div className='flex flex-col gap-2'>
            <div className='font-bold'>กลุ่มคำตอบ</div>
            <Select
                className='w-1/2'
                required
                label='จำนวนกลุ่ม'
                defaultValue={optionGroupCount && optionGroupCount[0]}
                options={optionGroupCount}
            />
            <div className="">
                <div className='text-base my-2'><span className='text-red-500'>*</span>ชื่อกลุ่ม#1</div>
                <div
                    className="form-input cursor-pointer"
                    onClick={() => handleShowModalTranslate && handleShowModalTranslate({ show: true, callback: (value) => handleChangeOptions('answer_group_' + 1, value) })}
                >
                    ชื่อกลุ่ม
                </div>
            </div>
            <div className="">
                <div className='text-base my-2'><span className='text-red-500'>*</span>ชื่อกลุ่ม#2</div>
                <div
                    className="form-input cursor-pointer"
                    onClick={() => handleShowModalTranslate && handleShowModalTranslate({ show: true, callback: (value) => handleChangeOptions('answer_group_' + 2, value) })}
                >
                    ชื่อกลุ่ม
                </div>
            </div>
            <Divider />
            <div className='font-bold'>ตัวเลือกคำตอบถูก</div>
            <div className='grid grid-cols-3 gap-2'>
                <Select
                    required
                    label='รูปแบบตัวเลือก'
                    defaultValue={optionPatternSelect[0]}
                    options={optionPatternSelect}
                />
                <Select
                    required
                    label='จำนวนตัวเลือกคำตอบถูก'
                    defaultValue={optionCorrectSelect[0]}
                    options={optionCorrectSelect}
                />
                <Select
                    required
                    label='ใช้ตัวเลือกตอบซ้ำ'
                    defaultValue={optionDuplicateSelect[0]}
                    options={optionDuplicateSelect}
                />
            </div>
            <Input
                required
                label='ตัวเลือกคำตอบที่ 1'
                placeholder="ตัวเลือกคำตอบที่ 1"
            />
            <Input
                required
                label='ตัวเลือกคำตอบที่ 2'
                placeholder="ตัวเลือกคำตอบที่ 2"
            />
            <Divider />
            <div className='font-bold'>ตัวเลือกหลอก</div>
            <div className='grid grid-cols-3 gap-2'>
                <Select
                    required
                    label='จำนวนตัวเลือกหลอก'
                    defaultValue={optionCorrectSelect[0]}
                    options={optionCorrectSelect}
                />
            </div>
            <Input
                required
                label='ตัวเลือกหลอกที่ 1'
                placeholder="ตัวเลือกหลอกที่ 1"
            />
            <Input
                required
                label='ตัวเลือกหลอกที่ 2'
                placeholder="ตัวเลือกหลอกที่ 2"
            />
        </div>
    );
};

export default FormPairing;