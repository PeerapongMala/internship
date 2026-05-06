
import { Divider } from "../../../../../../components/Divider";
import FormSelectLayoutImage from "../../molecule/FormSelectLayoutImage";
import Select from 'react-select';

const FormLayout = ({
    selectedLayoutRatio,
    selectedLayoutPattern,
    answerPosition,
    layoutPosition,
    optionsColumn,
    handleChangeOptions,
}: {
    selectedLayoutRatio: string
    selectedLayoutPattern: string
    answerPosition: { id: string, imgSrc: string, title: string }[]
    layoutPosition: { id: string, imgSrc: string, title: string }[]
    optionsColumn: { value: string, label: string }[]
    handleChangeOptions: (key: string, value: string) => void
}) => {
    return (
        <>
            <h1 className="text-xl font-bold">ตั้งค่าการจัดหน้า (Layout)</h1>
            <Divider />
            <div className='text-base my-2'><span className='text-red-500'>*</span> เลือกรูปแบบ Layout:</div>
            <FormSelectLayoutImage
                onChange={(layout) => handleChangeOptions('position', layout)}
                layoutOptions={answerPosition}
                value={selectedLayoutPattern}
            />
            <div className='text-base my-2'><span className='text-red-500'>*</span> เลือกสัดส่วน Layout:</div>
            <FormSelectLayoutImage
                onChange={(layout) => handleChangeOptions('layout', layout)}
                layoutOptions={layoutPosition}
                value={selectedLayoutRatio}
            />
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <div className='text-base my-2'><span className='text-red-500'>*</span> รูปแบบ แถวและคอลัมน์ ของตัวเลือก:</div>
                    <Select
                        defaultValue={optionsColumn[1]}
                        options={optionsColumn}
                        isSearchable={false}
                        onChange={(e) => handleChangeOptions('answerColumn', e?.value ?? '')}
                    />
                </div>
                <div>
                    <div className='text-base my-2'><span className='text-red-500'>*</span> รูปแบบ แถวและคอลัมน์ ของกลุ่ม:</div>
                    <Select
                        defaultValue={optionsColumn[1]}
                        options={optionsColumn}
                        isSearchable={false}
                        onChange={(e) => handleChangeOptions('groupColumn', e?.value ?? '')}
                    />
                </div>
            </div>
        </>
    )
};

export default FormLayout;
