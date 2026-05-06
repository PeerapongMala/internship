import Placeholder from "./Placeholder";
import FormInput from "./FormInput";
import { Divider } from "../../../../../../components/Divider";
import TabPanelHint from "../../organism/TabPanelHint";
import TabPanelQuiz from "../../organism/TabPanelQuiz";

const FormQuiz = ({
    setInputQustion,
    setInputTopic,
    setInputHint,
    setInputQustionImage,
    setInputHintImage,
    questionType,
    inputTopic,
    handleShowModalTranslate,
}: {
    setInputQustion: (value: string) => void;
    setInputTopic: (value: string) => void;
    setInputHint: (value: string) => void;
    setInputQustionImage: (images: any) => void;
    setInputHintImage: (images: any) => void;
    questionType: string;
    inputTopic: string;
    handleShowModalTranslate: (value: { show: boolean; callback: (value: string) => void }) => void;
}) => {
    return (
        <>
            <h1 className="text-xl font-bold">โจทย์</h1>
            <Divider />

            <div className='text-base my-2'><span className='text-red-500'>*</span> คำสั่ง:</div>
            <div
                className="form-input cursor-pointer"
                onClick={() => handleShowModalTranslate({ show: true, callback: (value) => setInputTopic?.(value) })}
            >
                {inputTopic || <div className="text-gray-500">กรุณาเลือกคำตอบ</div>}
            </div>

            {questionType === 'multiple-choice' || questionType === 'pairing' || questionType === 'sorting' && (
                <>
                    <div className='text-base my-2 mt-4'><span className='text-red-500'>*</span> โจทย์:</div>
                    <TabPanelQuiz setInputQustion={setInputQustion} setInputQustionImage={setInputQustionImage} />
                </>
            )}

            <div className='text-base my-2 mt-4'><span className='text-red-500'>*</span> คำใบ้ (ถ้ามี):</div>
            <TabPanelHint setInputHint={setInputHint} setInputHintImage={setInputHintImage} />

            {questionType === 'placeholder' && (
                <div className="mt-5 flex flex-col gap-2">
                    <Divider />
                    <Placeholder />
                </div>
            )}

            {questionType === 'input' && (
                <div className="mt-5 flex flex-col gap-2">
                    <Divider />
                    <FormInput />
                </div>
            )}

        </>
    )
};

export default FormQuiz;
