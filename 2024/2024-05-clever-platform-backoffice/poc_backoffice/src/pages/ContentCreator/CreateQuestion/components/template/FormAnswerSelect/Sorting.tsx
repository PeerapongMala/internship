import { FormAnswerSelectProps } from ".";
import { Divider } from "../../../../../../components/Divider";
import { Checkbox, Input, Select } from "../../../../../../components/Input";

const FormSorting = ({
    handleShowModalTranslate,
    handleChangeOptions,
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
            <div className='font-bold'>ตัวเลือกคำตอบถูก</div>
            <div className='grid grid-cols-3 gap-2'>
                <Select
                    required
                    label='รูปแบบตัวเลือก'
                    defaultValue={optionPatternSelect[0]}
                    options={optionPatternSelect}
                    disabled
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
            <div className="">
                <div className='text-base my-2'><span className='text-red-500'>*</span>ตัวเลือกคำตอบที่ 1</div>
                <div
                    className="form-input cursor-pointer"
                    onClick={() => handleShowModalTranslate && handleShowModalTranslate({ show: true, callback: (value) => handleChangeOptions('answer_sorting_' + 1, value) })}
                >
                    ตัวเลือกคำตอบที่
                </div>
            </div>
            <Divider />
            <Checkbox
                label={<div className='font-bold'>ตัวเลือกหลอก</div>}
            />
            <div className='grid grid-cols-3 gap-2'>
                <Select
                    required
                    label='จำนวนตัวเลือกหลอก'
                    defaultValue={optionCorrectSelect[0]}
                    options={optionCorrectSelect}
                />
            </div>
            <div className="">
                <div className='text-base my-2'><span className='text-red-500'>*</span>ตัวเลือกหลอกที่ 1</div>
                <div
                    className="form-input cursor-pointer"
                    onClick={() => handleShowModalTranslate && handleShowModalTranslate({ show: true, callback: (value) => handleChangeOptions('answer_sorting_fake' + 1, value) })}
                >
                    ตัวเลือกหลอกที่ 2
                </div>
            </div>
        </div>
    );
};

export default FormSorting;
