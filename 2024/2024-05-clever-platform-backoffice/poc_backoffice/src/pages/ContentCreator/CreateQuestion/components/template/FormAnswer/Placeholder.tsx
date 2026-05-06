import { Divider } from "../../../../../../components/Divider";
import { Checkbox, Input } from "../../../../../../components/Input";

const FormPlaceholder = () => {
    return (
        <div className='flex flex-col gap-2'>
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

export default FormPlaceholder;
