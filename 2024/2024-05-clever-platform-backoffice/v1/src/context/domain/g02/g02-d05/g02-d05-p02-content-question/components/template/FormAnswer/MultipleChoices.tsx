import { FormAnswerProps } from '.';
import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import {
  Input,
  Select,
} from '@core/design-system/library/vristo/source/components/Input';
import InputTranslate from '../../atom/InputTranslate';

const FormMultipleChoices = ({
  inputAnswerList,
  inputAnswerListFake,
  selectedAnswerCorrect,
  handleChangeOptions,
  handleShowModalTranslate,
  inputCorrectText,
  inputWrongText,
}: FormAnswerProps) => {
  return (
    <>
      {/* <div>
                <Select
                    required
                    label='รูปแบบตัวเลือกคำตอบ'
                    defaultValue={optionAnswerCount && optionAnswerCount[0]}
                    options={optionAnswerCount}
                    isSearchable={false}
                    onChange={(e) => setSelectedAnswerCount?.((e as { value: string })?.value ?? '')}
                />
            </div> */}
      {/* {selectedAnswerCount === "one" && (
                <div className="grid grid-cols-2 gap-2 items-end mb-4">
                    <Select
                        required
                        label='ตัวเลือกที่ถูกต้อง'
                        defaultValue={optionAnswerCorrect?.[0] ?? { value: '', label: '' }}
                        options={optionAnswerCorrect}
                        isSearchable={false}
                        onChange={(e) => setSelectedAnswerCorrect?.((e as { value: string })?.value ?? '')}
                    />
                    <div className="mb-2">
                        {findAnswer?.choice &&
                            <>
                                {findAnswer.choice}:
                            </>
                        }
                        {findAnswer?.answer}
                    </div>
                </div>
            )} */}
      <div className="mt-4">
        <h1 className="text-xl font-bold">คะแนน</h1>
        {inputAnswerList?.map((inputAnswer, index) => (
          <div key={index} className="mb-4 grid grid-cols-2 items-end gap-2 !text-base">
            <div className="mb-2">ตัวเลือกคำตอบที่ {inputAnswer.index}</div>
            <div>
              <input
                type="number"
                className="form-input w-full"
                value={inputAnswer?.point?.toString() ?? '0'}
                onChange={(e) =>
                  handleChangeOptions?.(
                    `answer_score_${inputAnswer.index}`,
                    e.target.value,
                  )
                }
              />
            </div>
          </div>
        ))}
        {inputAnswerListFake?.map((inputAnswer, index) => (
          <div key={index} className="mb-4 grid grid-cols-2 items-end gap-2 !text-base">
            <div className="mb-2">ตัวเลือกหลอกที่ {inputAnswer.index}</div>
            <div>
              <input
                type="number"
                className="form-input w-full"
                value={inputAnswer?.point?.toString() ?? '0'}
                onChange={(e) =>
                  handleChangeOptions?.(
                    `answer_score_fake_${inputAnswer.index}`,
                    e.target.value,
                  )
                }
              />
            </div>
          </div>
        ))}
        {/* <Select
                        className="w-1/2"
                        required
                        label='Max score'
                        placeholder="Max score"
                        options={inputAnswerScoreList}
                        onChange={(e) => handleChangeOptions?.('max_score', (e as { value: string })?.value ?? '')}
                        value={inputAnswerScoreList?.find((item) => item.value === selectedAnswerScore?.toString())}
                    /> */}
      </div>
      <Divider />
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
    </>
  );
};

export default FormMultipleChoices;
