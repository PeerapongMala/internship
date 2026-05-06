import { useEffect, useState } from 'react';
import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import {
  Checkbox,
  Input,
  Radio,
  Select,
} from '@core/design-system/library/vristo/source/components/Input';
import { FormQuizSelectProps } from '.';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import IconTrash from '@core/design-system/library/component/icon/IconTrash';
import IconSymbol from '@asset/icon/symbol.svg';
import {
  AnswerPlaceholderProps,
  TranslationTextQuestion,
} from '@domain/g02/g02-d05/local/type';
import ModalSample from '../../organism/ModalSample';
import ModalSampleRegex from '../../organism/ModalSampleRegex';
import CWButton from '@component/web/cw-button';
import CWModalLatexEditor from '@component/web/cw-modal/cw-modal-latex-editor';

const FormInput = ({
  handleChangeOptions,
  inputQustionList,
  selectedHintType,
  selectedQuestionInputType,
}: FormQuizSelectProps) => {
  const [showModalSample, setShowModalSample] = useState(false);
  const [showModalSampleRegex, setShowModalSampleRegex] = useState(false);

  const optionsQuestionInputType = [
    { label: 'กรอกข้อความด้วยแป้นพิมพ์', value: 'text' },
    { label: 'กรอกข้อความด้วยเสียง', value: 'speech' },
  ];

  return (
    <div className="flex flex-col">
      <ModalSample open={showModalSample} setOpen={setShowModalSample} />
      <ModalSampleRegex open={showModalSampleRegex} setOpen={setShowModalSampleRegex} />
      <div className="flex justify-between">
        <div className="text-lg font-bold">ตั้งค่าการกรอกคำตอบ</div>
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowModalSample(true)}
          type="button"
        >
          ตัวอย่างการกรอกโจทย์
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <Select
          // disabled
          label="ประเภทการกรอกคำตอบ"
          value={optionsQuestionInputType.find(
            (item) => item.value === selectedQuestionInputType,
          )}
          options={optionsQuestionInputType}
          defaultValue={{ label: 'กรอกข้อความด้วยแป้นพิมพ์', value: 'text' }}
          onChange={(selectedOption) => {
            if (selectedOption?.value) {
              handleChangeOptions('inputType', selectedOption.value);
            }
          }}
        />
      </div>
      <div className="flex flex-col gap-4">
        {inputQustionList?.map((itemQuestion, index) => (
          <div key={index} className="flex w-full flex-col">
            <div className="flex items-end gap-4">
              <Input
                className="w-full"
                required
                placeholder={`กรอกโจทย์`}
                label={<div className="font-bold">โจทย์ย่อย #{itemQuestion.index}:</div>}
                value={itemQuestion.value}
                onInput={(e) => {
                  handleChangeOptions('question_' + itemQuestion.index, e.target.value);
                }}
              />
              <div
                className={cn(
                  'mb-2 h-6 w-6 cursor-pointer text-red-500',
                  inputQustionList.length === 1 && 'pointer-events-none text-gray-300',
                )}
                onClick={() =>
                  handleChangeOptions('questionRemove', String(itemQuestion.index))
                }
              >
                <IconTrash className="h-6 w-6" />
              </div>
            </div>
            <div className="flex w-full flex-col pl-10">
              <FormAnswerInput
                itemQuestion={itemQuestion}
                handleChangeOptions={handleChangeOptions}
                setShowModalSampleRegex={setShowModalSampleRegex}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline-primary w-32"
          onClick={() => handleChangeOptions('questionAdd', '')}
        >
          เพิ่มโจทย์
        </button>
      </div>
      <Divider />
      <div className="flex flex-col gap-2">
        <div className="text-base">
          <span className="text-red-500">* </span>แสดงคำใบ้คำตอบ:
        </div>
        <Radio
          required
          type="radio"
          label="ไม่แสดงคำใบ้เลย เช่น  Ann: Good Morning, ______ do you do?"
          name="answer"
          onChange={() => handleChangeOptions('hintType', 'none')}
          checked={selectedHintType === 'none'}
        />
        <Radio
          required
          type="radio"
          label={
            <span>
              แสดงจำนวนตัวอักษรของคำตอบ เช่น Ann: Good Morning, ___
              <span className="font-bold">(3)</span>___ do you do?
            </span>
          }
          name="answer"
          onChange={() => handleChangeOptions('hintType', 'count')}
          checked={selectedHintType === 'count'}
        />
      </div>
    </div>
  );
};

const FormAnswerInput = ({
  itemQuestion,
  handleChangeOptions,
  setShowModalSampleRegex,
}: {
  itemQuestion: TranslationTextQuestion;
  handleChangeOptions?: (key: string, value: string) => void;
  setShowModalSampleRegex: (show: boolean) => void;
}) => {
  return (
    <div className="flex w-full flex-col gap-2">
      {itemQuestion?.answerList.map((itemAnswer, answerIndex) => (
        <div key={answerIndex} className="grid grid-cols-1 items-end gap-4">
          <FormAnswerInputItem
            itemQuestion={itemQuestion}
            itemAnswer={itemAnswer}
            handleChangeOptions={handleChangeOptions}
            setShowModalSampleRegex={setShowModalSampleRegex}
          />

          <Divider />
        </div>
      ))}
    </div>
  );
};

const FormAnswerInputItem = ({
  itemQuestion,
  itemAnswer,
  handleChangeOptions,
  setShowModalSampleRegex,
}: {
  itemQuestion: TranslationTextQuestion;
  itemAnswer: AnswerPlaceholderProps;
  handleChangeOptions?: (key: string, value: string) => void;
  setShowModalSampleRegex: (show: boolean) => void;
}) => {
  const [showModalSLatexEditor, setShowModalSLaTexEditor] = useState([false]);
  const optionsAnswerType = [
    { label: 'กรอกรูปแบบคำตอบทั้งหมด (Array)', value: 'array' },
    {
      label: 'กรอกรูปแบบคำตอบด้วย Regular expression',
      value: 'regex',
    },
  ];
  const [isMultiAnswer, setIsMultiAnswer] = useState(false);

  const handleChangePatternAnswer = (value: string) => {
    handleChangeOptions?.(
      `questionTypeAnswer_${itemQuestion.index}_answer_${itemAnswer.index}`,
      value,
    );
  };

  const handleCheckMultiAnswer = () => {
    const textIndex = itemAnswer.text.length;
    const indexes = [];
    for (let i = textIndex - 1; i >= 1; i--) {
      const itemText = itemAnswer.text[i];
      indexes.push(itemText.index);
    }
    handleChangeOptions?.(
      'questionRemoveAnswer_' + itemQuestion.index + '_answer_' + itemAnswer.index,
      indexes.join(','),
    );
  };

  const handleOpenLatexEditor = () => { };

  useEffect(() => {
    if (itemAnswer.type !== 'normal' && itemAnswer.type !== '') {
      setIsMultiAnswer(true);
    }
    const textIndex = itemAnswer.text.length;
    if (textIndex > 1) {
      setIsMultiAnswer(true);
    }
  }, [itemAnswer.type, itemAnswer.text]);

  return (
    <div className="flex flex-col gap-2">
      <div className="mt-4 flex gap-1 text-base">
        <span className="text-red-500">*</span>
        <span>เฉลย</span>
        <span>{itemAnswer.answerText}:</span>
      </div>
      <div className="grid min-h-10 grid-cols-2">
        <Checkbox
          className="select-none"
          label="มีคำตอบมากกว่า 1 รูปแบบ"
          onChange={(e) => {
            setIsMultiAnswer(e.target.checked);
            if (!e.target.checked) {
              handleCheckMultiAnswer();
              // handleChangePatternAnswer("normal");
            } else {
              // handleChangePatternAnswer("array");
            }
          }}
          checked={isMultiAnswer}
        />
        {isMultiAnswer && (
          <div className="flex flex-col gap-2">
            {/* <Select
              options={optionsAnswerType}
              value={optionsAnswerType.find(
                (item) => item.value === itemAnswer.type,
              )}
              className="w-full"
              onChange={(e) => handleChangePatternAnswer(e.value)}
            />
            {itemAnswer.type === "regex" && (
              <div
                className="cursor-pointer underline text-primary w-fit"
                onClick={() => setShowModalSampleRegex(true)}
              >
                ตัวย่างการใช้ Regular expression
              </div>
            )} */}
          </div>
        )}
      </div>
      {itemAnswer.text.map((itemText, textIndex) => (
        <div className="flex w-full items-end gap-4" key={textIndex}>
          <CWModalLatexEditor
            value={itemText.text}
            open={showModalSLatexEditor[textIndex] || false}
            onClose={() => {
              const updatedState = [...showModalSLatexEditor];
              updatedState[textIndex] = false;
              setShowModalSLaTexEditor(updatedState);
            }}
            setValue={(value) => {
              handleChangeOptions?.(
                'questionSelectAnswer_' +
                  itemQuestion.index +
                  '_answer_' +
                  itemAnswer.index +
                  '_text_' +
                  itemText.index,
                value,
              );
            }}
          />
          <div className="relative h-full w-full">
            <Input
              className="w-full"
              required
              placeholder={`กรอกคำตอบที่ ${textIndex + 1}`}
              value={itemText.text}
              onInput={(e) => {
                handleChangeOptions?.(
                  'questionSelectAnswer_' +
                    itemQuestion.index +
                    '_answer_' +
                    itemAnswer.index +
                    '_text_' +
                    itemText.index,
                  e.target.value,
                );
              }}
            />
            <div
              onClick={() => {
                const updatedState = [...showModalSLatexEditor];
                updatedState[textIndex] = true;
                setShowModalSLaTexEditor(updatedState);
              }}
              className="absolute right-0 top-0 flex h-full w-10 cursor-pointer items-center justify-center !rounded-md !rounded-l-none border-4 border-[#FF6B00] bg-[#FF6B00]/90 text-4xl font-bold text-white"
            >
              <IconSymbol />
            </div>
          </div>

          <div
            className={cn(
              'mb-2 h-6 w-6 cursor-pointer text-red-500',
              itemAnswer.text.length === 1 && 'pointer-events-none text-gray-300',
            )}
            onClick={() =>
              handleChangeOptions?.(
                'questionRemoveAnswer_' +
                  itemQuestion.index +
                  '_answer_' +
                  itemAnswer.index,
                String(itemText.index),
              )
            }
          >
            <IconTrash className="h-6 w-6" />
          </div>
        </div>
      ))}
      <CWButton
        disabled={!isMultiAnswer}
        className="w-32"
        outline
        type="button"
        onClick={() => {
          handleChangeOptions?.(
            'questionAddAnswer_' + itemQuestion.index + '_answer_' + itemAnswer.index,
            '',
          );
        }}
        title="เพิ่มคำตอบ"
      />
    </div>
  );
};

export default FormInput;
