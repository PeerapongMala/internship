import { Divider } from '../../../../../../components/Divider';
import FormMultipleChoices from './MultipleChoices';
import FormPairing from './Pairing';
import FormSorting from './Sorting';
import FormPlaceholder from './Placeholder';

export interface FormAnswerSelectProps {
    inputAnswerList?: { choice?: string, answer: string }[]
    inputAnswerListFake?: { choice?: string, answer: string }[]
    optionsAnswerSelect?: { value: string, label: string }[]
    optionsAnswerSelectCount?: { value: string, label: string }[]
    optionsAnswerSelectFakeCount?: { value: string, label: string }[]
    optionGroupCount?: { value: string, label: string }[]
    handleChangeOptions: (key: string, value: string) => void
    selectedAnswerOptionCount?: number
    selectedAnswerOptionFakeCount?: number
    questionType?: string
    optionAnswerCount?: { value: string, label: string }[]
    handleShowModalTranslate?: (props: { show: boolean, callback: (value: string) => void }) => void
}

const FormAnswerSelect = ({
    inputAnswerList,
    inputAnswerListFake,
    optionsAnswerSelect,
    optionsAnswerSelectCount,
    optionsAnswerSelectFakeCount,
    optionGroupCount,
    handleChangeOptions,
    selectedAnswerOptionCount,
    selectedAnswerOptionFakeCount,
    questionType,
    handleShowModalTranslate,
}: FormAnswerSelectProps) => {
    return (
        <>
            <h1 className="text-xl font-bold">ตัวเลือกคำตอบ</h1>
            <Divider />
            {questionType === 'multiple-choice' && (
                <FormMultipleChoices
                    inputAnswerList={inputAnswerList}
                    inputAnswerListFake={inputAnswerListFake}
                    optionsAnswerSelect={optionsAnswerSelect}
                    optionsAnswerSelectCount={optionsAnswerSelectCount}
                    optionsAnswerSelectFakeCount={optionsAnswerSelectFakeCount}
                    handleChangeOptions={handleChangeOptions}
                    selectedAnswerOptionCount={selectedAnswerOptionCount}
                    selectedAnswerOptionFakeCount={selectedAnswerOptionFakeCount}
                    handleShowModalTranslate={handleShowModalTranslate}
                />
            )}
            {questionType === 'pairing' && (
                <FormPairing
                    optionGroupCount={optionGroupCount}
                    handleChangeOptions={handleChangeOptions}
                    selectedAnswerOptionCount={selectedAnswerOptionCount}
                    handleShowModalTranslate={handleShowModalTranslate}
                />
            )}

            {questionType === 'sorting' && (
                <FormSorting
                    handleChangeOptions={handleChangeOptions}
                    handleShowModalTranslate={handleShowModalTranslate}
                />
            )}

            {questionType === 'placeholder' && (
                <FormPlaceholder
                    handleChangeOptions={handleChangeOptions}
                />
            )}
        </>
    )
};

export default FormAnswerSelect;
