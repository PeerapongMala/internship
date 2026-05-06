import Placeholder from './Placeholder';
import FormInput from './FormInput';
import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import TabPanelHint from '../../organism/TabPanelHint';
import TabPanelQuiz from '../../organism/TabPanelQuiz';

import {
  AnswerProps,
  ModalTranslate,
  QuestionListProps,
  TranslationText,
  TranslationTextQuestion,
  HintType,
  QuestionInputType,
  AcademicLevelLanguage,
} from '@domain/g02/g02-d05/local/type';
import InputTranslate from '../../atom/InputTranslate';
import {
  Checkbox,
  RadioTab,
} from '@core/design-system/library/vristo/source/components/Input';

export interface FormQuizSelectProps {
  setInputQustion?: (value: TranslationText) => void;
  setInputTopic?: (value: TranslationText) => void;
  setInputHint?: (value: TranslationText) => void;
  setInputQustionImage?: (images: any) => void;
  setInputHintImage?: (images: any) => void;
  questionType?: string;
  inputQustion?: TranslationText;
  inputQustionImage?: any;
  inputHint?: TranslationText;
  inputHintImage?: any;
  inputTopic?: TranslationText;
  handleShowModalTranslate?: ModalTranslate;
  handleChangeOptions: (
    key: string,
    value: string,
    translation?: TranslationText,
    file?: File,
  ) => void;
  useSoundDescriptionOnly?: boolean;
  inputQustionList?: TranslationTextQuestion[];
  inputAnswerList?: AnswerProps[];
  enforceDescriptionLanguage?: boolean;
  selectedHintType?: HintType;
  selectedQuestionInputType?: QuestionInputType;
  language?: AcademicLevelLanguage;
}

const FormQuiz = ({
  setInputQustion,
  setInputTopic,
  setInputHint,
  setInputQustionImage,
  setInputHintImage,
  questionType,
  inputQustion,
  inputQustionImage,
  inputHint,
  inputHintImage,
  inputTopic,
  handleShowModalTranslate,
  handleChangeOptions,
  useSoundDescriptionOnly,
  inputQustionList,
  inputAnswerList,
  enforceDescriptionLanguage,
  selectedHintType,
  selectedQuestionInputType,
  language,
}: FormQuizSelectProps) => {
  return (
    <>
      <div className="flex w-full justify-between">
        <h1 className="text-xl font-bold">โจทย์</h1>
        <div className="flex">
          <RadioTab
            name="enforced_language"
            label={`บังคับใช้ภาษาของบทเรียน : ${language?.language}`}
            onChange={(e) =>
              handleChangeOptions?.(
                'enforceDescriptionLanguage',
                e.target.checked ? 'true' : 'false',
              )
            }
            checked={enforceDescriptionLanguage}
            className="rounded-l uppercase"
          />
          <RadioTab
            name="enforced_language"
            label={`อนุญาตให้แปล : ${language?.translations.join(' ')}`}
            onChange={(e) =>
              handleChangeOptions?.(
                'enforceDescriptionLanguage',
                e.target.checked ? 'false' : 'true',
              )
            }
            checked={!enforceDescriptionLanguage}
            className="rounded-r uppercase"
          />
        </div>
      </div>
      <Divider />

      <InputTranslate
        callback={setInputTopic}
        handleShowModalTranslate={handleShowModalTranslate}
        label="คำสั่ง"
        placeholder="กรุณาเลือกคำสั่ง"
        value={inputTopic}
        onClear={() => setInputTopic && setInputTopic({ id: '', value: '' })}
      />

      <div className="my-2 mt-4 text-base">โจทย์:</div>
      <TabPanelQuiz
        inputQustion={inputQustion || { id: '', value: '' }}
        inputQustionImage={inputQustionImage}
        setInputQustion={setInputQustion || (() => {})}
        setInputQustionImage={setInputQustionImage || (() => {})}
        handleShowModalTranslate={handleShowModalTranslate}
        onClear={() => setInputQustion && setInputQustion({ id: '', value: '' })}
      />
      <Checkbox
        className="mt-2"
        label="ใช้เสียงแทนข้อความ"
        onChange={(e) => {
          handleChangeOptions(
            'useSoundDescriptionOnly',
            e.target.checked ? 'true' : 'false',
          );
        }}
        checked={useSoundDescriptionOnly}
      />

      <div className="my-2 mt-4 text-base">
        {/* <span className='text-red-500'>*</span> */}
        คำใบ้ (ถ้ามี):
      </div>
      <TabPanelHint
        inputHint={inputHint || { id: '', value: '' }}
        inputHintImage={inputHintImage}
        setInputHint={setInputHint || (() => {})}
        setInputHintImage={setInputHintImage || (() => {})}
        handleShowModalTranslate={handleShowModalTranslate}
        onClear={() => setInputHint && setInputHint({ id: '', value: '' })}
      />

      {questionType === 'placeholder' && (
        <div className="mt-5 flex flex-col gap-2">
          <Divider />
          <Placeholder
            handleChangeOptions={handleChangeOptions}
            inputQustionList={inputQustionList}
            inputAnswerList={inputAnswerList}
            handleShowModalTranslate={handleShowModalTranslate}
            selectedHintType={selectedHintType}
          />
        </div>
      )}

      {questionType === 'input' && (
        <div className="mt-5 flex flex-col gap-2">
          <Divider />
          <FormInput
            handleChangeOptions={handleChangeOptions}
            inputQustionList={inputQustionList}
            inputAnswerList={inputAnswerList}
            selectedHintType={selectedHintType}
            selectedQuestionInputType={selectedQuestionInputType}
          />
        </div>
      )}
    </>
  );
};

export default FormQuiz;
