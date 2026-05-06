import { useEffect, useState } from 'react';
import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import IconTrashLines from '@core/design-system/library/vristo/source/components/Icon/IconTrashLines';
import {
  Checkbox,
  Input,
} from '@core/design-system/library/vristo/source/components/Input';
import { Modal } from '@core/design-system/library/vristo/source/components/Modal';
import InputSorting from '../../../components/atom/InputSorting';
import { FormAnswerProps } from '.';
import InputTranslate from '../../atom/InputTranslate';
import IconCopy from '@core/design-system/library/component/icon/IconCopy';
import IconTrash from '@core/design-system/library/component/icon/IconTrash';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';

const FormSorting = ({
  inputAnswerList,
  handleChangeOptions,
  handleShowModalTranslate,
  inputCorrectText,
  inputWrongText,
  inputAnswerListSortByAnswerIndexes,
  setInputAnswerListSortByAnswerIndexes,
  selectedCanReuseChoice,
}: FormAnswerProps) => {
  const [open, setOpen] = useState(false);

  const findAnswerIndex = (inputAnswerIndex: number) => {
    if (!inputAnswerList) return;
    const answer = inputAnswerList.find((item) => item.index === inputAnswerIndex);
    return answer;
  };

  const checkInputAnswerIndexMoreThanOne = (inputAnswerIndex: number) => {
    if (!inputAnswerList) return;
    const answer = inputAnswerListSortByAnswerIndexes?.filter(
      (item) => item.inputAnswerIndex === inputAnswerIndex,
    );

    return (answer?.length ?? 0) > 1;
  };

  const handleSortInputAnswerList = (answerIndex: number, direction: 'up' | 'down') => {
    if (!inputAnswerListSortByAnswerIndexes) return;
    const index = inputAnswerListSortByAnswerIndexes.findIndex(
      (item) => item.answerIndex === answerIndex,
    );
    if (index === -1) return;

    let newInputAnswerListSortByAnswerIndexes = [...inputAnswerListSortByAnswerIndexes];
    const temp = newInputAnswerListSortByAnswerIndexes[index];
    newInputAnswerListSortByAnswerIndexes[index] =
      newInputAnswerListSortByAnswerIndexes[index + (direction === 'up' ? -1 : 1)];
    newInputAnswerListSortByAnswerIndexes[index + (direction === 'up' ? -1 : 1)] = temp;

    newInputAnswerListSortByAnswerIndexes = newInputAnswerListSortByAnswerIndexes.map(
      (item, index) => {
        return {
          inputAnswerIndex: item.inputAnswerIndex,
          answerIndex: index + 1,
        };
      },
    );

    setInputAnswerListSortByAnswerIndexes?.(newInputAnswerListSortByAnswerIndexes);
  };

  const handleCopyAnswer = (answerIndex: number) => {
    if (!inputAnswerListSortByAnswerIndexes) return;
    const index = inputAnswerListSortByAnswerIndexes.findIndex(
      (item) => item.answerIndex === answerIndex,
    );
    if (index === -1) return;

    const newInputAnswerListSortByAnswerIndexes = [...inputAnswerListSortByAnswerIndexes];
    newInputAnswerListSortByAnswerIndexes.splice(index + 1, 0, {
      ...inputAnswerListSortByAnswerIndexes[index],
    });

    for (let i = index + 1; i < newInputAnswerListSortByAnswerIndexes.length; i++) {
      newInputAnswerListSortByAnswerIndexes[i].answerIndex += 1;
    }

    setInputAnswerListSortByAnswerIndexes?.(newInputAnswerListSortByAnswerIndexes);
  };

  const handleDeleteAnswer = (answerIndex: number) => {
    if (!inputAnswerListSortByAnswerIndexes) return;
    const index = inputAnswerListSortByAnswerIndexes.findIndex(
      (item) => item.answerIndex === answerIndex,
    );
    if (index === -1) return;

    const newInputAnswerListSortByAnswerIndexes = [...inputAnswerListSortByAnswerIndexes];
    newInputAnswerListSortByAnswerIndexes.splice(index, 1);

    for (let i = index; i < newInputAnswerListSortByAnswerIndexes.length; i++) {
      newInputAnswerListSortByAnswerIndexes[i].answerIndex -= 1;
    }

    setInputAnswerListSortByAnswerIndexes?.(newInputAnswerListSortByAnswerIndexes);
  };

  useEffect(() => {
    if (!inputAnswerList) return;

    const newAnswerList = [];
    for (let i = 0; i < inputAnswerList.length; i++) {
      const answer = { ...inputAnswerList[i] };
      const answerIndexes = answer.answer_indexes;
      if (answerIndexes) {
        for (let j = 0; j < answerIndexes.length; j++) {
          const answerIndex = answerIndexes[j];
          if (answer.index !== undefined) {
            newAnswerList.push({
              inputAnswerIndex: answer.index,
              answerIndex,
            });
          }
        }
      }
    }
    newAnswerList.sort((a, b) => a.answerIndex - b.answerIndex);

    setInputAnswerListSortByAnswerIndexes?.(newAnswerList);
  }, [inputAnswerList]);

  return (
    <div className="flex flex-col gap-2">
      <ModalSorting
        open={open}
        onClose={() => setOpen(false)}
        onOk={() => setOpen(false)}
      />
      <div className="flex flex-col justify-center gap-4">
        <div className="font-bold">เรียงลำดับกล่องคำตอบ</div>
        <div className="flex flex-col gap-2">
          {inputAnswerListSortByAnswerIndexes?.map((answer, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-12">#{index + 1}</div>
              <div className="w-96">
                <InputSorting
                  label={`${findAnswerIndex(answer.inputAnswerIndex)?.value}`}
                  onUp={() => handleSortInputAnswerList?.(answer.answerIndex, 'up')}
                  onDown={() => handleSortInputAnswerList?.(answer.answerIndex, 'down')}
                  disabledUp={index === 0}
                  disabledDown={index === inputAnswerListSortByAnswerIndexes.length - 1}
                />
              </div>
              <div
                className={cn(
                  'h-6 w-6 cursor-pointer',
                  !selectedCanReuseChoice && 'pointer-events-none text-gray-300',
                )}
                onClick={() => handleCopyAnswer(answer.answerIndex)}
              >
                <IconCopy className="h-6 w-6" />
              </div>
              <div
                className={cn(
                  'h-6 w-6 cursor-pointer text-red-500',
                  !checkInputAnswerIndexMoreThanOne(answer.inputAnswerIndex) &&
                    'pointer-events-none text-gray-300',
                )}
                onClick={() => handleDeleteAnswer(answer.answerIndex)}
              >
                <IconTrash className="h-6 w-6" />
              </div>
            </div>
          ))}
        </div>
        <Divider />
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

const ModalSorting = ({
  open,
  onClose,
  onOk,
}: {
  open: boolean;
  onClose: () => void;
  onOk: () => void;
}) => {
  return (
    <Modal
      className="h-[26rem] w-3/4"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="เลือกคำตอบ"
    >
      <div className="flex flex-col gap-2">
        <label className="inline-flex w-full items-center gap-2">
          <input type="checkbox" className="form-checkbox" defaultChecked />
          <Input className="w-full" placeholder="คำตอบ" />
        </label>
      </div>
    </Modal>
  );
};

export default FormSorting;
