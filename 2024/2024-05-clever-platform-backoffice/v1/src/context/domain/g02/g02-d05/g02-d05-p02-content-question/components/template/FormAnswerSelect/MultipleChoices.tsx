import React, { useState, useRef } from 'react';
import { FormAnswerSelectProps } from '.';
import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import { Select } from '@core/design-system/library/vristo/source/components/Input';
import { ImageAnswer, InputAnswer, SoundAnswer } from '../../atom/InputAnswer';
import InputTranslate from '../../atom/InputTranslate';

const FormMultipleChoices = ({
  inputAnswerList,
  inputAnswerListFake,
  optionsAnswerSelect,
  optionsAnswerSelectCount,
  optionsAnswerSelectFakeCount,
  handleChangeOptions,
  handleShowModalTranslate,
  answerType,
}: FormAnswerSelectProps) => {
  // const [answerType, setAnswerType] = useState(optionsAnswerSelect?.[0].value.toString());

  const handleChangeAnswerType = (value: string) => {
    // setAnswerType(value);
    handleChangeOptions('answerType', value);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-2">
        <Select
          required
          label="รูปแบบตัวเลือกคำตอบ"
          options={optionsAnswerSelect}
          isSearchable={false}
          onChange={(e) => {
            if (!Array.isArray(e) && e && 'value' in e) {
              handleChangeAnswerType(e.value.toString() ?? '');
            }
          }}
          value={optionsAnswerSelect?.find((option) => option.value === answerType)}
        />
      </div>
      <div className="font-bold">ตัวเลือกคำตอบถูก</div>
      <div>
        <Select
          required
          label="จำนวนตัวเลือกคำตอบ"
          // defaultValue={optionsAnswerSelectCount && optionsAnswerSelectCount[4]}
          value={optionsAnswerSelectCount?.find(
            (option) => option.value === inputAnswerList?.length.toString(),
          )}
          options={optionsAnswerSelectCount}
          isSearchable={false}
          onChange={(e) => {
            if (!Array.isArray(e)) {
              if (e && 'value' in e) {
                handleChangeOptions('answerSelectCount', e.value.toString() ?? '');
              }
            }
          }}
        />
      </div>
      <div className="flex flex-col">
        {[...(inputAnswerList ?? [])]
          ?.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
          .map((inputAnswer, index) => (
            <React.Fragment key={index}>
              {(answerType === 'text-speech' || answerType === 'speech') && (
                <InputTranslate
                  callback={(value) =>
                    handleChangeOptions('answer_' + inputAnswer.index, '', value)
                  }
                  handleShowModalTranslate={handleShowModalTranslate}
                  label={`ตัวเลือกคำตอบที่ ${inputAnswer.index}`}
                  placeholder="กรุณาเลือกคำตอบ"
                  required
                  value={inputAnswer}
                />
              )}

              {answerType === 'image' && (
                <ImageAnswer
                  key={index}
                  inputAnswer={inputAnswer}
                  label={`ตัวเลือกคำตอบที่ ${inputAnswer.index}`}
                  index={inputAnswer.index}
                  handleChangeOptions={handleChangeOptions}
                  handleShowModalTranslate={handleShowModalTranslate}
                  keyAnswer="answer_"
                />
              )}

              {/* {answerType === 'speech' && (
                            <SoundAnswer
                                key={index}
                                inputAnswer={inputAnswer}
                                index={index}
                                handleChangeOptions={handleChangeOptions}
                                handleShowModalTranslate={handleShowModalTranslate}
                                keyAnswer="answer_"
                            />
                        )} */}
            </React.Fragment>
          ))}
      </div>
      <Divider />
      <div className="font-bold">ตัวเลือกหลอก</div>
      <div>
        <Select
          required
          label="จำนวนตัวเลือกหลอก"
          // defaultValue={optionsAnswerSelectFakeCount && optionsAnswerSelectFakeCount[1]}
          value={optionsAnswerSelectFakeCount?.find(
            (option) => option.value === inputAnswerListFake?.length.toString(),
          )}
          options={optionsAnswerSelectFakeCount}
          isSearchable={false}
          onChange={(e) => {
            if (!Array.isArray(e)) {
              if (e && 'value' in e) {
                handleChangeOptions('answerSelectFakeCount', e.value.toString() ?? '');
              }
            }
          }}
        />
      </div>
      <div className="flex flex-col">
        {[...(inputAnswerListFake ?? [])]
          ?.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
          .map((inputAnswer, index) => (
            <React.Fragment key={index}>
              {(answerType === 'text-speech' || answerType === 'speech') && (
                <InputTranslate
                  callback={(value) =>
                    handleChangeOptions('answer_fake_' + inputAnswer.index, '', value)
                  }
                  handleShowModalTranslate={handleShowModalTranslate}
                  label={`ตัวเลือกหลอกที่ ${inputAnswer.index}`}
                  placeholder="กรุณาเลือกคำตอบ"
                  required
                  value={inputAnswer}
                />
              )}

              {answerType === 'image' && (
                <ImageAnswer
                  key={index}
                  inputAnswer={inputAnswer}
                  label={`ตัวเลือกหลอกที่ ${inputAnswer.index}`}
                  index={inputAnswer.index}
                  handleChangeOptions={handleChangeOptions}
                  handleShowModalTranslate={handleShowModalTranslate}
                  keyAnswer={`answer_fake_`}
                />
              )}
              {/* 
                        {answerType === 'speech' && (
                            <SoundAnswer
                                key={index}
                                inputAnswer={inputAnswer}
                                index={index}
                                handleChangeOptions={handleChangeOptions}
                                handleShowModalTranslate={handleShowModalTranslate}
                                keyAnswer={`answer_fake_`}
                            />
                        )} */}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default FormMultipleChoices;
