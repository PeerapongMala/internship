import { Divider } from "../../../../../../components/Divider";
import { Select, Input, Checkbox } from "../../../../../../components/Input";
import FormMultipleChoices from "./MultipleChoices";
import FormPairing from "./Pairing";
import FormSorting from "./Sorting";
import FormPlaceholder from "./Placeholder";
import FormInput from "./FormInput";

export interface FormAnswerProps {
    setSelectedAnswerCount: (value: string) => void
    setSelectedAnswerCorrect: (value: string) => void
    inputAnswerList: { choice?: string, answer: string }[]
    selectedAnswerCorrect: string
    selectedAnswerCount: string
    questionType?: string
    optionAnswerCount?: { value: string, label: string }[]
}

const FormAnswer = ({
    setSelectedAnswerCount,
    setSelectedAnswerCorrect,
    inputAnswerList,
    selectedAnswerCorrect,
    selectedAnswerCount,
    questionType,
    optionAnswerCount,
}: FormAnswerProps) => {
    return (
        <>
            <h1 className="text-xl font-bold">เฉลย</h1>
            <Divider />
            {questionType === 'multiple-choice' && (
                <FormMultipleChoices
                    setSelectedAnswerCount={setSelectedAnswerCount}
                    setSelectedAnswerCorrect={setSelectedAnswerCorrect}
                    inputAnswerList={inputAnswerList}
                    selectedAnswerCorrect={selectedAnswerCorrect}
                    selectedAnswerCount={selectedAnswerCount}
                    optionAnswerCount={optionAnswerCount}
                />
            )}

            {questionType === 'pairing' && (
                <FormPairing />
            )}

            {questionType === 'sorting' && (
                <FormSorting />
            )}

            {questionType === 'placeholder' && (
                <FormPlaceholder />
            )}
            
            {questionType === 'input' && (
                <FormInput />
            )}
        </>
    );
};

export default FormAnswer;
