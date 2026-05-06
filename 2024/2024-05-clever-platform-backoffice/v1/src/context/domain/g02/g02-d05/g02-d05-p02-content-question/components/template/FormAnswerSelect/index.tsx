import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import FormMultipleChoices from './MultipleChoices';
import FormPairing from './Pairing';
import FormSorting from './Sorting';
import FormPlaceholder from './Placeholder';
import {
  AcademicLevelLanguage,
  AnswerProps,
  ModalTranslate,
  TranslationText,
} from '@domain/g02/g02-d05/local/type';
import { RadioTab } from '@core/design-system/library/vristo/source/components/Input';

export interface FormAnswerSelectProps {
  inputAnswerList?: TranslationText[];
  inputAnswerListFake?: TranslationText[];
  inputAnswerGroupList?: TranslationText[];
  optionsAnswerSelect?: { value: string; label: string }[];
  optionsAnswerSelectCount?: { value: string; label: string }[];
  optionsAnswerSelectFakeCount?: { value: string; label: string }[];
  optionGroupCount?: { value: string; label: string }[];
  handleChangeOptions: (
    key: string,
    value: string,
    translation?: TranslationText,
    file?: File,
  ) => void;
  selectedAnswerOptionCount?: number;
  selectedAnswerOptionFakeCount?: number;
  questionType?: string;
  answerType?: string;
  optionAnswerCount?: { value: string; label: string }[];
  handleShowModalTranslate?: ModalTranslate;
  enforceChoiceLanguage?: boolean;
  selectedCanReuseChoice?: boolean;
  language?: AcademicLevelLanguage;
}

const FormAnswerSelect = ({
  inputAnswerList,
  inputAnswerListFake,
  inputAnswerGroupList,
  optionsAnswerSelect,
  optionsAnswerSelectCount,
  optionsAnswerSelectFakeCount,
  optionGroupCount,
  handleChangeOptions,
  selectedAnswerOptionCount,
  selectedAnswerOptionFakeCount,
  questionType,
  answerType,
  handleShowModalTranslate,
  enforceChoiceLanguage,
  selectedCanReuseChoice,
  language,
}: FormAnswerSelectProps) => {
  return (
    <>
      <div className="flex w-full justify-between">
        <h1 className="text-xl font-bold">ตัวเลือกคำตอบ</h1>
        <div className="flex">
          <RadioTab
            name="enforced_language"
            label={`บังคับใช้ภาษาของบทเรียน : ${language?.language}`}
            onChange={(e) =>
              handleChangeOptions(
                'enforceChoiceLanguage',
                e.target.checked ? 'true' : 'false',
              )
            }
            checked={enforceChoiceLanguage}
            className="rounded-l uppercase"
          />
          <RadioTab
            name="enforced_language"
            label={`อนุญาตให้แปล : ${language?.translations.join(' ')}`}
            onChange={(e) =>
              handleChangeOptions(
                'enforceChoiceLanguage',
                e.target.checked ? 'false' : 'true',
              )
            }
            checked={!enforceChoiceLanguage}
            className="rounded-r uppercase"
          />
        </div>
      </div>
      <Divider />
      {questionType === 'multiple-choices' && (
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
          answerType={answerType}
        />
      )}
      {questionType === 'pairing' && (
        <FormPairing
          inputAnswerGroupList={inputAnswerGroupList}
          optionGroupCount={optionGroupCount}
          handleChangeOptions={handleChangeOptions}
          selectedAnswerOptionCount={selectedAnswerOptionCount}
          handleShowModalTranslate={handleShowModalTranslate}
          optionsAnswerSelect={optionsAnswerSelect}
          inputAnswerList={inputAnswerList}
          optionsAnswerSelectCount={optionsAnswerSelectCount}
          optionsAnswerSelectFakeCount={optionsAnswerSelectFakeCount}
          inputAnswerListFake={inputAnswerListFake}
          answerType={answerType}
          selectedCanReuseChoice={selectedCanReuseChoice}
        />
      )}

      {questionType === 'sorting' && (
        <FormSorting
          optionsAnswerSelect={optionsAnswerSelect}
          optionsAnswerSelectCount={optionsAnswerSelectCount}
          optionsAnswerSelectFakeCount={optionsAnswerSelectFakeCount}
          handleChangeOptions={handleChangeOptions}
          handleShowModalTranslate={handleShowModalTranslate}
          inputAnswerList={inputAnswerList}
          inputAnswerListFake={inputAnswerListFake}
          answerType={answerType}
          selectedCanReuseChoice={selectedCanReuseChoice}
        />
      )}

      {questionType === 'placeholder' && (
        <FormPlaceholder
          inputAnswerGroupList={inputAnswerGroupList}
          optionGroupCount={optionGroupCount}
          handleChangeOptions={handleChangeOptions}
          selectedAnswerOptionCount={selectedAnswerOptionCount}
          handleShowModalTranslate={handleShowModalTranslate}
          optionsAnswerSelect={optionsAnswerSelect}
          inputAnswerList={inputAnswerList}
          optionsAnswerSelectCount={optionsAnswerSelectCount}
          optionsAnswerSelectFakeCount={optionsAnswerSelectFakeCount}
          inputAnswerListFake={inputAnswerListFake}
          answerType={answerType}
          selectedCanReuseChoice={selectedCanReuseChoice}
        />
      )}
    </>
  );
};

export default FormAnswerSelect;
