import IconArrowLeft from "@/components/Icon/IconArrowLeft";
import IconPlus from "@/components/Icon/IconPlus";
import { Modal } from "@/components/Modal";
import { cn } from "@/utils/cn";

const ModalQuestionOrder = ({ open, onClose, onOk, data }: {
    open: boolean;
    onClose: () => void;
    onOk: () => void;
    data: { label: string, index: number, disabledUp?: boolean, disabledDown?: boolean }[];
}) => {
    return (
        <Modal
            className="w-[27rem]"
            open={open}
            onClose={onClose}
            onOk={onOk}
            disableCancel
            disableOk
            title="จัดการคำถาม"
        >
            <div className="flex flex-col gap-4">
                <button className="btn btn-primary w-full">
                    <IconPlus />
                    เพิ่มคำถาม
                </button>
                <div className="grid grid-cols-[10%_90%] gap-2 items-center pt-2">
                    {data.map((item) => (
                        <InputOrder
                            key={item.index}
                            label={item.label}
                            index={item.index}
                            disabledUp={item.disabledUp}
                            disabledDown={item.disabledDown}
                        />
                    ))}
                </div>
                <div className="flex gap-4">
                    <button className="btn btn-outline-primary w-full">
                        ยกเลิก
                    </button>
                    <button className="btn btn-primary w-full">
                        บันทึก
                    </button>
                </div>
            </div>
        </Modal>
    );
}

const InputOrder = ({
    label,
    index,
    disabledUp,
    disabledDown,
}: {
    label?: string,
    index: number,
    disabledUp?: boolean,
    disabledDown?: boolean,
}) => {

    const classNameDisabled = "pointer-events-none opacity-20";

    return (
        <>
            <div>#{index}</div>
            <div className="flex justify-between form-input h-10 items-center w-full">
                <div className="font-normal truncate">
                    {label}
                </div>
                <div className="flex gap-2">
                    <IconArrowLeft className={cn("h-6 w-6 -rotate-90 cursor-pointer", disabledUp && classNameDisabled)} />
                    <IconArrowLeft className={cn("h-6 w-6 rotate-90 cursor-pointer", disabledDown && classNameDisabled)} />
                </div>
            </div>
        </>
    )
}

export default ModalQuestionOrder;
