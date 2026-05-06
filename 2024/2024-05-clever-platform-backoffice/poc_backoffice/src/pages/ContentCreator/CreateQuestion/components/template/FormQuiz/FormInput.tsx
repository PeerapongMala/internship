import { useState } from "react";
import { Divider } from "../../../../../../components/Divider";
import IconTrashLines from "../../../../../../components/Icon/IconTrashLines";
import { Checkbox, Input, Radio, Select } from "../../../../../../components/Input";
import { Modal } from "../../../../../../components/Modal";
import IconVolumeLoud from "../../../../../../components/Icon/IconVolumeLoud";

const FormInput = () => {
    const [showModalSample, setShowModalSample] = useState(false);
    const [showModalSampleRegex, setShowModalSampleRegex] = useState(false);

    return (
        <div className="flex flex-col">
            <ModalSample open={showModalSample} setOpen={setShowModalSample} />
            <ModalSampleRegex open={showModalSampleRegex} setOpen={setShowModalSampleRegex} />
            <div className="flex justify-between">
                <div className="font-bold text-lg">
                    ตั้งค่าการกรอกคำตอบ
                </div>
                <button
                    className="btn btn-outline-primary"
                    onClick={() => setShowModalSample(true)}
                >
                    ตัวอย่างการกรอกโจทย์
                </button>
            </div>
            <div className="flex flex-col gap-2">
                <Select
                    // disabled
                    label="ประเภทการกรอกคำตอบ"
                    // value='กรอกอข้อความด้วยแป้นพิมพ์'
                    options={[
                        { label: 'กรอกอข้อความด้วยแป้นพิมพ์', value: 'text' },
                        { label: 'เลือกคำตอบ', value: 'select' },
                        { label: 'เลือกคำตอบหลายตัวเลือก', value: 'multi-select' },
                    ]}
                    defaultValue={{ label: 'กรอกอข้อความด้วยแป้นพิมพ์', value: 'text' }}
                />
            </div>
            <div className="w-full">
                <Input
                    required
                    label={<div className="font-bold text-base">โจทย์#1</div>}
                    value='Ann: Good Morning, {Ans1} do you do?'
                />
                <div className="flex flex-col ml-10 my-4 gap-2">
                    <div className="grid grid-cols-2">
                        <Checkbox
                            label="มีคำตอบมากกว่า 1 รูปแบบ"
                        />
                        <div className="flex flex-col gap-2">
                            <Select
                                options={[
                                    { label: 'กรอกรูปแบบคำตอบทั้งหมด (Array)', value: 'array' },
                                    { label: 'กรอกรูปแบบคำตอบด้วย Regular expression', value: 'regex' },
                                ]}
                                defaultValue={{ label: 'กรอกรูปแบบคำตอบทั้งหมด (Array)', value: 'array' }}
                                className="w-full"
                            />
                            <div
                                className="cursor-pointer underline text-primary w-fit"
                                onClick={() => setShowModalSampleRegex(true)}
                            >
                                ตัวย่างการใช้ Regular expression
                            </div>
                        </div>
                    </div>
                    <div className="flex items-end gap-2 w-full">
                        <Input
                            className="w-full"
                            placeholder="ตัวเลือกคำตอบที่ 1"
                            value='How'
                        />
                        <div className="mb-2 w-6 h-6 cursor-pointer">
                            <IconTrashLines className="w-full h-full" />
                        </div>
                    </div>
                    <div className="flex items-end gap-2 w-full">
                        <Input
                            className="w-full"
                            placeholder="ตัวเลือกคำตอบที่ 1"
                            value='How'
                        />
                        <div className="mb-2 w-6 h-6 cursor-pointer">
                            <IconTrashLines className="w-full h-full" />
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

const ModalSample = ({ open, setOpen }: { open: boolean, setOpen: (show: boolean) => void }) => {
    return (
        <Modal
            title="ตัวอย่างการกรอกโจทย์"
            onClose={() => setOpen(false)}
            open={open}
            className="w-3/4 h-fit"
            disableCancel
            disableOk
        >
            <div className="flex flex-col gap-2">
                <div>1. การกรอกโจทย์ใช้สัญลักษณ์ของกล่องคำตอบในการสร้างประโยคและจัดตำแหน่งกล่องคำตอบ</div>
                <div className="font-bold">สัญลักษณ์สำหรับกล่องคำตอบ:</div>
                <Input
                    className="w-full"
                    value='{Ans1},  {Ans2},  {Ans3},  {AnsN},...'
                />
                <div className="font-bold">ตัวอย่าง:</div>
                <ul className="space-y-3 list-inside list-disc ml-2">
                    <li className="mb-1">
                        {'ต้อการสร้างโจทย์: “The sun rises in the east and sets in the west” และคำว่า “in” เป็นช่องที่ต้องการให้นักเรียนกรอก'}
                    </li>
                    <li className="mb-1">
                        {'การกรอกโจทย์จะมีลักษณะ ดังนี้'}
                    </li>
                    <li className="mb-1 flex ml-4">
                        {'The sun rises {Ans1} the east and sets {Ans2} the west.'}
                    </li>
                </ul>
                <div className="mt-2">2. สร้างโจทย์เพื่อแยกการอ่านออกเสียงทีละบรรทัด เช่น</div>
                <div className="ml-8 flex justify-between">
                    <div className="flex gap-2">
                        <IconVolumeLoud className="w-6 h-6" />
                        <div className="">{'Ann: Good Morning, {Ans1} do you do?'}</div>
                    </div>
                    <div className="text-gray-500">
                        โจทย์#1
                    </div>
                </div>
                <div className="ml-8 flex justify-between">
                    <div className="flex gap-2">
                        <IconVolumeLoud className="w-6 h-6" />
                        <div className="">{'Mali: Good Morning, {Ans2} fine, {Ans3} about you?'}</div>
                    </div>
                    <div className="text-gray-500">
                        โจทย์#2
                    </div>
                </div>
                <div className="mt-2">3. ระบบจะตรวจคำตอบโดยไม่สนใจ Case Sensitive และ Double Space</div>
            </div>
            <div className="flex justify-between mt-6">
                <button type="button" className="btn btn-outline-primary w-32 ltr:mr-4 rtl:ml-4" onClick={() => setOpen(false)}>
                    ย้อนกลับ
                </button>
                <button type="button" className="btn btn-primary w-32 ltr:ml-4 rtl:mr-4">
                    ตกลง
                </button>
            </div>
        </Modal>
    );
};

const ModalSampleRegex = ({ open, setOpen }: { open: boolean, setOpen: (show: boolean) => void }) => {
    return (
        <Modal
            title="ตัวอย่างการใช้ Regular expression"
            onClose={() => setOpen(false)}
            open={open}
            className="w-3/4 h-fit"
            disableOk
            disableCancel
        >
            <div>Lorem ipsum dolor sit amet consectetur. Et urna tellus odio magna sit. Eget non aenean adipiscing mi. Odio id pellentesque lectus blandit laoreet hendrerit.</div>
            <div className="flex justify-between mt-6">
                <button type="button" className="btn btn-outline-primary w-32 ltr:mr-4 rtl:ml-4" onClick={() => setOpen(false)}>
                    ย้อนกลับ
                </button>
                <button type="button" className="btn btn-primary w-32 ltr:ml-4 rtl:mr-4">
                    ตกลง
                </button>
            </div>
        </Modal>
    );
};

export default FormInput;
