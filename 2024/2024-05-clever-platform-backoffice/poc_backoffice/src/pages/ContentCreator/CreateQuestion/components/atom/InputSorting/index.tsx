import IconArrowLeft from "../../../../../../components/Icon/IconArrowLeft";

const InputSorting = ({ label }: { label?: string }) => {
    return (
        <div className="flex justify-between form-input h-10 p-[5px] px-2 w-full">
            <span className="badge badge-outline-info">{label}</span>
            <div className="flex gap-2">
                <IconArrowLeft className="h-6 w-6 -rotate-90 cursor-pointer" />
                <IconArrowLeft className="h-6 w-6 rotate-90 cursor-pointer" />
            </div>
        </div>
    )
}

export default InputSorting;
