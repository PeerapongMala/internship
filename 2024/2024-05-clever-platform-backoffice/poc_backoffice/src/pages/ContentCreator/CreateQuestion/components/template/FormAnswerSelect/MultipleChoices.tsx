import { FormAnswerSelectProps } from ".";
import { Divider } from "../../../../../../components/Divider";
import { Select } from "../../../../../../components/Input";

const FormMultipleChoices = ({
    inputAnswerList,
    inputAnswerListFake,
    optionsAnswerSelect,
    optionsAnswerSelectCount,
    optionsAnswerSelectFakeCount,
    handleChangeOptions,
    handleShowModalTranslate,
}: FormAnswerSelectProps) => {
    return (
        <div className="flex flex-col gap-2">
            <div className='font-bold'>ตัวเลือกคำตอบถูก</div>
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <Select
                        required
                        label='รูปแบบตัวเลือกคำตอบ'
                        defaultValue={optionsAnswerSelect && optionsAnswerSelect[0]}
                        options={optionsAnswerSelect}
                        isSearchable={false}
                        onChange={(e) => handleChangeOptions('answerType', (e as { value: string })?.value ?? '')}
                    />
                </div>
                <div>
                    <Select
                        required
                        label='จำนวนตัวเลือกคำตอบ'
                        defaultValue={optionsAnswerSelectCount && optionsAnswerSelectCount[4]}
                        options={optionsAnswerSelectCount}
                        isSearchable={false}
                        onChange={(e) => {
                            if (!Array.isArray(e)) {
                                if (e && 'value' in e) {
                                    handleChangeOptions('answerSelectCount', e.value.toString() ?? '');
                                }
                            }
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-col pt-4">
                {inputAnswerList?.map((inputAnswer, index) => (
                    <div key={index} className="">
                        <div className='text-base my-2'><span className='text-red-500'>*</span> ตัวเลือกคำตอบที่ {index + 1}</div>
                        <div
                            className="form-input cursor-pointer"
                            onClick={() => handleShowModalTranslate && handleShowModalTranslate({ show: true, callback: (value) => handleChangeOptions('answer_' + index, value) })}
                        >
                            {inputAnswer.answer || <div className="text-gray-500">กรุณาเลือกคำตอบ</div>}
                        </div>
                    </div>
                ))}
            </div>
            <Divider />
            <div className='font-bold'>ตัวเลือกหลอก</div>
            <div>
                <Select
                    required
                    label='จำนวนตัวเลือกหลอก'
                    defaultValue={optionsAnswerSelectFakeCount && optionsAnswerSelectFakeCount[1]}
                    options={optionsAnswerSelectFakeCount}
                    isSearchable={false}
                    onChange={(e) => {
                        if (!Array.isArray(e)) {
                            if (e && 'value' in e) {
                                handleChangeOptions('answerSelectFakeCount', e.value.toString() ?? '');
                            }
                        }
                    }}
                />
            </div>
            <div className="flex flex-col">
                {inputAnswerListFake?.map((inputAnswer, index) => (
                    <div key={index} className="">
                        <div className='text-base my-2'><span className='text-red-500'>*</span> ตัวเลือกหลอกที่ {index + 1}</div>
                        <div
                            className="form-input text-base font-normal select-none cursor-pointer"
                            onClick={() => handleShowModalTranslate && handleShowModalTranslate({ show: true, callback: (value) => handleChangeOptions('answer_fake_' + index, value) })}
                        >
                            {inputAnswer.answer || <div className="text-gray-500">กรุณาเลือกคำตอบ</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
};

export default FormMultipleChoices;