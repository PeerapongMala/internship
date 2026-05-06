import { Divider } from "../../../../../../components/Divider";
import { Checkbox, Input, Radio, Select } from "../../../../../../components/Input";

const FormInput = () => {
    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <div className="font-bold text-lg">
                    ตั้งค่าการกรอกคำตอบ
                </div>
                <button className="btn btn-outline-primary">ตัวอย่างการกรอกโจทย์</button>
            </div>
            <div className="flex flex-col gap-2">
                <Input
                    disabled
                    label="ประเภทการกรอกคำตอบ"
                    value='กรอกอข้อความด้วยแป้นพิมพ์'
                />
            </div>
            <div>
                <Input
                    required
                    label={<div className="font-bold text-base">โจทย์#1</div>}
                    value='ชีวิต = {Ans1} '
                />
                <div className="flex flex-col ml-10 my-4 gap-2">
                    <div className="grid grid-cols-2 gap-2 items-end">
                        <Select
                            required
                            label="เฉลย {Ans1}"
                            options={[
                                { label: 'ตัวเลือกคำตอบที่ 1', value: 'text1' },
                                { label: 'ตัวเลือกคำตอบที่ 2', value: 'text2' },
                                { label: 'ตัวเลือกคำตอบที่ 3', value: 'text3' },
                            ]}
                            defaultValue={{ label: 'ตัวเลือกคำตอบที่ 1', value: 'text1' }}
                        />
                        <div className="mb-2">
                            Text คำตอบที่ 1
                        </div>
                    </div>
                    <button className="btn btn-outline-primary w-32">เพิ่มคำตอบ</button>
                </div>
                <Divider />
            </div>
            <div>
                <Input
                    required
                    label={<div className="font-bold text-base">โจทย์#2</div>}
                    value='ปลา =  {Ans1}'
                />
                <div className="flex flex-col ml-10 my-4 gap-2">
                    <div className="grid grid-cols-2 gap-2 items-end">
                        <Select
                            required
                            label="เฉลย {Ans1}"
                            options={[
                                { label: 'ตัวเลือกคำตอบที่ 1', value: 'text1' },
                                { label: 'ตัวเลือกคำตอบที่ 2', value: 'text2' },
                                { label: 'ตัวเลือกคำตอบที่ 3', value: 'text3' },
                            ]}
                            defaultValue={{ label: 'ตัวเลือกคำตอบที่ 1', value: 'text1' }}
                        />
                        <div className="mb-2">
                            Text คำตอบที่ 1
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 items-end">
                        <Select
                            required
                            label="เฉลย {Ans2}"
                            options={[
                                { label: 'ตัวเลือกคำตอบที่ 1', value: 'text1' },
                                { label: 'ตัวเลือกคำตอบที่ 2', value: 'text2' },
                                { label: 'ตัวเลือกคำตอบที่ 3', value: 'text3' },
                            ]}
                            defaultValue={{ label: 'ตัวเลือกคำตอบที่ 2', value: 'text1' }}
                        />
                        <div className="mb-2">
                            Text คำตอบที่ 2
                        </div>
                    </div>
                    <button className="btn btn-outline-primary w-32">เพิ่มคำตอบ</button>
                </div>
                <Divider />
            </div>
            <div className="flex gap-4">
                <button className="btn btn-outline-primary w-32">เพิ่มคำตอบ</button>
                <button className="btn btn-outline-primary w-32">เพิ่มโจทย์</button>
            </div>
            <Divider />
            <div className="flex flex-col gap-2">
                <div className="text-base"><span className='text-red-500'>*</span>แสดงตำใบ้คำตอบ:</div>
                <Radio
                    type="radio"
                    label="ไม่แสดงคำใบ้เลย เช่น  Ann: Good Morning, ______ do you do?"
                    name="answer"
                />
                <Radio
                    type="radio"
                    label="แสดงจำนวนตัวอักษรของคำตอบ เช่น Ann: Good Morning, ___(3)___ do you do?"
                    name="answer"
                />
                <Radio
                    type="radio"
                    label="แสดงจำนวนตัวอักษรของคำตอบ และตัวอักษรหัวท้าย เช่น Ann: Good Morning, H__(1)_w do you do?"
                    name="answer"
                />
                <Radio
                    type="radio"
                    label="แสดงตัวอักษรหัวท้ายของคำตอบ เช่น Ann: Good Morning, H____w do you do?"
                    name="answer"
                />
            </div>
        </div>
    );
}

export default FormInput;
