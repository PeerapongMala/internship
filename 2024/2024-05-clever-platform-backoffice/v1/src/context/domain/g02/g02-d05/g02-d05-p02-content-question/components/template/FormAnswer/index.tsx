import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import {
  Select,
  Input,
  Checkbox,
} from '@core/design-system/library/vristo/source/components/Input';
import FormMultipleChoices from './MultipleChoices';
import FormPairing from './Pairing';
import FormSorting from './Sorting';
import FormPlaceholder from './Placeholder';
import FormInput from './FormInput';
import {
  AnswerProps,
  ModalTranslate,
  TranslationText,
  TranslationTextQuestion,
} from '@domain/g02/g02-d05/local/type';

export interface FormAnswerProps {
  setSelectedAnswerCount?: (value: string) => void;
  setSelectedAnswerCorrect?: (value: string) => void;
  inputAnswerList?: TranslationText[];
  inputAnswerListFake?: TranslationText[];
  selectedAnswerCorrect?: string;
  selectedAnswerCount?: string;
  questionType?: string;
  optionAnswerCount?: { value: string; label: string }[];
  inputAnswerGroupList?: TranslationText[];
  handleChangeOptions?: (
    key: string,
    value: string,
    translations?: TranslationText,
  ) => void;
  inputAnswerScoreList?: { value: string; label: string }[];
  selectedAnswerScore?: number;
  handleShowModalTranslate?: ModalTranslate;
  inputCorrectText?: TranslationText;
  inputWrongText?: TranslationText;
  inputQustionList?: TranslationTextQuestion[];
  inputAnswerListSortByAnswerIndexes?: {
    inputAnswerIndex: number;
    answerIndex: number;
  }[];
  setInputAnswerListSortByAnswerIndexes?: (
    value: { inputAnswerIndex: number; answerIndex: number }[],
  ) => void;
  selectedCanReuseChoice?: boolean;
  answerType?: string;
}

const FormAnswer = ({
  setSelectedAnswerCount,
  setSelectedAnswerCorrect,
  inputAnswerList,
  inputAnswerListFake,
  selectedAnswerCorrect,
  selectedAnswerCount,
  questionType,
  optionAnswerCount,
  inputAnswerGroupList,
  handleChangeOptions,
  inputAnswerScoreList,
  selectedAnswerScore,
  handleShowModalTranslate,
  inputCorrectText,
  inputWrongText,
  inputQustionList,
  inputAnswerListSortByAnswerIndexes,
  setInputAnswerListSortByAnswerIndexes,
  selectedCanReuseChoice,
  answerType,
}: FormAnswerProps) => {
  return (
    <>
      <h1 className="text-xl font-bold">เฉลย</h1>
      <Divider />
      {questionType === 'multiple-choices' && (
        <FormMultipleChoices
          setSelectedAnswerCount={setSelectedAnswerCount}
          setSelectedAnswerCorrect={setSelectedAnswerCorrect}
          inputAnswerList={inputAnswerList}
          inputAnswerListFake={inputAnswerListFake}
          selectedAnswerCorrect={selectedAnswerCorrect}
          selectedAnswerCount={selectedAnswerCount}
          optionAnswerCount={optionAnswerCount}
          handleChangeOptions={handleChangeOptions}
          inputAnswerScoreList={inputAnswerScoreList}
          selectedAnswerScore={selectedAnswerScore}
          handleShowModalTranslate={handleShowModalTranslate}
          inputCorrectText={inputCorrectText}
          inputWrongText={inputWrongText}
        />
      )}

      {questionType === 'pairing' && (
        <FormPairing
          inputAnswerGroupList={inputAnswerGroupList}
          inputAnswerList={inputAnswerList}
          handleChangeOptions={handleChangeOptions}
          handleShowModalTranslate={handleShowModalTranslate}
          inputCorrectText={inputCorrectText}
          inputWrongText={inputWrongText}
          selectedCanReuseChoice={selectedCanReuseChoice}
          answerType={answerType}
        />
      )}

      {questionType === 'sorting' && (
        <FormSorting
          inputAnswerList={inputAnswerList}
          handleChangeOptions={handleChangeOptions}
          handleShowModalTranslate={handleShowModalTranslate}
          inputCorrectText={inputCorrectText}
          inputWrongText={inputWrongText}
          inputAnswerListSortByAnswerIndexes={inputAnswerListSortByAnswerIndexes}
          setInputAnswerListSortByAnswerIndexes={setInputAnswerListSortByAnswerIndexes}
          selectedCanReuseChoice={selectedCanReuseChoice}
        />
      )}

      {questionType === 'placeholder' && (
        <FormPlaceholder
          handleShowModalTranslate={handleShowModalTranslate}
          handleChangeOptions={handleChangeOptions}
          inputQustionList={inputQustionList}
          inputAnswerList={inputAnswerList}
          inputCorrectText={inputCorrectText}
          inputWrongText={inputWrongText}
        />
      )}

      {questionType === 'input' && (
        <FormInput
          handleShowModalTranslate={handleShowModalTranslate}
          handleChangeOptions={handleChangeOptions}
          inputCorrectText={inputCorrectText}
          inputWrongText={inputWrongText}
        />
      )}
    </>
  );
};

export default FormAnswer;
