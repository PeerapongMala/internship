import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import {
  Checkbox,
  Input,
  Select,
} from '@core/design-system/library/vristo/source/components/Input';
import { FormAnswerProps } from '.';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import IconTrash from '@core/design-system/library/component/icon/IconTrash';
import { useState, useEffect } from 'react';
import { TranslationText } from '@domain/g02/g02-d05/local/type';
import InputTranslate from '../../atom/InputTranslate';

const FormPlaceholder = ({
  inputQustionList,
  handleChangeOptions,
  inputAnswerList,
  handleShowModalTranslate,
  inputCorrectText,
  inputWrongText,
}: FormAnswerProps) => {
  const [optionsAnswerList, setOptionsAnswerList] = useState<
    { label: string; value: string }[]
  >([]);

  const filterAndMapAnswers = (answers: TranslationText[]) => {
    return (
      answers
        ?.filter((item) => item.value)
        .map((item) => ({
          label: item.value || '',
          value: item.index?.toString() || '',
        })) || []
    );
  };

  const findAnswer = (choiceIndex: number) => {
    const option = optionsAnswerList.find(
      (item) => item.value === choiceIndex.toString(),
    );
    if (!option && optionsAnswerList.length > 0 && choiceIndex !== -1) {
      return null;
    }
    return option || null;
  };

  useEffect(() => {
    setOptionsAnswerList(inputAnswerList ? filterAndMapAnswers(inputAnswerList) : []);
  }, [inputAnswerList]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        {inputQustionList?.map((itemQuestion, index) => (
          <div key={index}>
            <span className="font-bold">
              โจทย์ย่อย #{itemQuestion.index}: {itemQuestion.value}
            </span>
            <div className="ml-10 flex flex-col gap-2">
              {itemQuestion?.answerList.map((itemAnswer, answerIndex) => (
                <div key={answerIndex} className="grid grid-cols-1 items-end gap-4">
                  <div className="mt-4 flex gap-1 text-base">
                    <span className="text-red-500">*</span>
                    <span>เฉลย</span>
                    <span>{itemAnswer.answerText}:</span>
                  </div>
                  {itemAnswer.text.map((itemText, textIndex) => (
                    <div className="flex w-full items-end gap-4" key={itemText.index}>
                      <Select
                        className="w-full"
                        required
                        options={optionsAnswerList}
                        onChange={(e) =>
                          handleChangeOptions?.(
                            'questionSelectAnswer_' +
                              itemQuestion.index +
                              '_answer_' +
                              itemAnswer.index +
                              '_text_' +
                              itemText.index,
                            e.value,
                          )
                        }
                        value={findAnswer(itemText.choice_index)}
                      />
                      <div className="mb-2 w-10">
                        <div
                          className={cn(
                            'h-6 w-6 cursor-pointer text-red-500',
                            itemAnswer.text.length === 1 &&
                              'pointer-events-none text-gray-300',
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
                    </div>
                  ))}
                  <button
                    className="btn btn-outline-primary w-32"
                    type="button"
                    onClick={() => {
                      handleChangeOptions?.(
                        'questionAddAnswer_' +
                          itemQuestion.index +
                          '_answer_' +
                          itemAnswer.index,
                        '',
                      );
                    }}
                  >
                    เพิ่มคำตอบ
                  </button>
                </div>
              ))}
            </div>
            <Divider />
          </div>
        ))}
      </div>
      <InputTranslate
        callback={(value) => handleChangeOptions?.('inputCorrectText', '', value)}
        handleShowModalTranslate={handleShowModalTranslate}
        label="คำอธิบายเมื่อคำตอบถูก"
        placeholder="คำตอบถูกต้อง"
        // required
        value={inputCorrectText}
      />
      <InputTranslate
        callback={(value) => handleChangeOptions?.('inputWrongText', '', value)}
        handleShowModalTranslate={handleShowModalTranslate}
        label="คำอธิบายเมื่อคำตอบผิด"
        placeholder="คำตอบผิด"
        value={inputWrongText}
      />
    </div>
  );
};

export default FormPlaceholder;
