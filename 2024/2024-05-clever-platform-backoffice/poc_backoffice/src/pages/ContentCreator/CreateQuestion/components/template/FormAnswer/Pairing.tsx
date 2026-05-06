import { Divider } from "../../../../../../components/Divider";
import { Checkbox, Input } from "../../../../../../components/Input";

const FormPairing = () => {
    return (
        <div className='flex flex-col gap-2'>
            <div className="flex flex-col gap-4 justify-center">
                <div className="font-bold">
                    ชื่อกลุ่ม 1
                </div>
                <div className="grid grid-cols-3">
                    <Checkbox
                        label="คำตอบที่#1"
                    />
                    <Checkbox
                        label="คำตอบที่#2"
                    />
                    <Checkbox
                        label="คำตอบที่#3"
                    />
                </div>
                <Divider />
            </div>
            <div className="flex flex-col gap-4 justify-center">
                <div className="font-bold">
                    ชื่อกลุ่ม 2
                </div>
                <div className="grid grid-cols-3">
                    <Checkbox
                        label="คำตอบที่#1"
                    />
                    <Checkbox
                        label="คำตอบที่#2"
                    />
                    <Checkbox
                        label="คำตอบที่#3"
                    />
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

export default FormPairing;
