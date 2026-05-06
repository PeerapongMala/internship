import { FormAnswerProps } from ".";
import { Divider } from "../../../../../../components/Divider";
import { Input, Select } from "../../../../../../components/Input";

const FormMultipleChoices = ({
    setSelectedAnswerCount,
    setSelectedAnswerCorrect,
    inputAnswerList,
    selectedAnswerCorrect,
    selectedAnswerCount,
    optionAnswerCount,
}: FormAnswerProps) => {
    const optionAnswerCorrect = inputAnswerList.map((item, index) => ({ value: (index + 1).toString(), label: `คำตอบที่ ${index + 1}` }));
    const findAnswer = inputAnswerList[parseInt(selectedAnswerCorrect) - 1];
    return (
        <>
            <div>
                <Select
                    required
                    label='รูปแบบตัวเลือกคำตอบ'
                    defaultValue={optionAnswerCount && optionAnswerCount[0]}
                    options={optionAnswerCount}
                    isSearchable={false}
                    onChange={(e) => setSelectedAnswerCount?.((e as { value: string })?.value ?? '')}
                />
            </div>
            {parseInt(selectedAnswerCount) === 1 && (
                <div className="grid grid-cols-2 gap-2 items-end mb-4">
                    <Select
                        required
                        label='ตัวเลือกที่ถูกต้อง'
                        defaultValue={optionAnswerCorrect[0]}
                        options={optionAnswerCorrect}
                        isSearchable={false}
                        onChange={(e) => setSelectedAnswerCorrect?.((e as { value: string })?.value ?? '')}
                    />
                    <div className="mb-2">
                        {findAnswer?.choice &&
                            <>
                                {findAnswer.choice}:
                            </>
                        }
                        {findAnswer?.answer}
                    </div>
                </div>
            )}
            {parseInt(selectedAnswerCount) > 1 && (
                <div className="mt-4">
                    <h1 className="text-xl font-bold">คะแนน</h1>
                    {inputAnswerList.map((_, index) => (
                        <div key={index} className="grid grid-cols-2 gap-2 items-end mb-4">
                            <div className="mb-2">
                                ตัวเลือกคำตอบที่ {index + 1}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    className="form-input w-full"
                                    defaultValue={0}
                                />
                            </div>
                        </div>
                    ))}
                    <Select
                        className="w-1/2"
                        required
                        label='Max score'
                        placeholder="Max score"
                    />
                </div>
            )}
            <Divider />
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
        </>
    )
};

export default FormMultipleChoices;
