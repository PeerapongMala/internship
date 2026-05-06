import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import {
  Input,
  Radio,
  Select,
} from '@core/design-system/library/vristo/source/components/Input';
import { FormQuizSelectProps } from '.';
import InputTranslate from '../../atom/InputTranslate';
import IconTrash from '@core/design-system/library/component/icon/IconTrash';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { HintTypeOptions } from '@domain/g02/g02-d05/local/type';
import ModalSample from '../../organism/ModalSample';
import { useState } from 'react';

const FormPlaceholder = ({
  handleChangeOptions,
  inputQustionList,
  handleShowModalTranslate,
  selectedHintType,
}: FormQuizSelectProps) => {
  const [showModalSample, setShowModalSample] = useState(false);

  return (
    <div className="flex flex-col">
      <ModalSample open={showModalSample} setOpen={setShowModalSample} />
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
      {/* <div className="flex flex-col gap-2">
        <Input
          disabled
          label="ประเภทการกรอกคำตอบ"
          value="กรอกข้อความด้วยแป้นพิมพ์"
        />
      </div> */}
      <div className="flex flex-col gap-4">
        {inputQustionList?.map((item, index) => (
          <div key={index} className="flex w-full items-end gap-4">
            <div className="w-full">
              {/* <InputTranslate
              callback={(value) =>
                handleChangeOptions("question_" + item.index, "", value)
              }
              handleShowModalTranslate={handleShowModalTranslate}
              label={<div className="font-bold">โจทย์ย่อย #{item.index}:</div>}
              placeholder="กรอกโจทย์"
              required
              value={item}
            /> */}
              <Input
                required
                placeholder={`กรอกโจทย์`}
                label={<div className="font-bold">โจทย์ย่อย #{item.index}:</div>}
                value={item.value}
                onInput={(e) => {
                  handleChangeOptions('question_' + item.index, e.target.value);
                }}
              />
            </div>
            <div className="mb-2 w-10">
              <div
                className={cn(
                  'h-6 w-6 cursor-pointer text-red-500',
                  inputQustionList.length === 1 && 'pointer-events-none text-gray-300',
                )}
                onClick={() => handleChangeOptions('questionRemove', String(item.index))}
              >
                <IconTrash className="h-6 w-6" />
              </div>
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
          label={HintTypeOptions.find((item) => item.value === 'none')?.label}
          name="answer"
          onChange={() => handleChangeOptions('hintType', 'none')}
          checked={selectedHintType === 'none'}
        />
        <Radio
          required
          type="radio"
          // label={
          //   <span>
          //     แสดงจำนวนตัวอักษรของคำตอบ เช่น Ann: Good Morning, ___
          //     <span className="font-bold">(3)</span>___ do you do?
          //   </span>
          // }
          label={HintTypeOptions.find((item) => item.value === 'count')?.label}
          name="answer"
          onChange={() => handleChangeOptions('hintType', 'count')}
          checked={selectedHintType === 'count'}
        />
      </div>
    </div>
  );
};

export default FormPlaceholder;
