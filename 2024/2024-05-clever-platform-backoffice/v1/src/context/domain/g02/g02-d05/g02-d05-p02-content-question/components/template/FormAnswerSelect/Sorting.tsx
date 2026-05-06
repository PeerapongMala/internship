import { FormAnswerSelectProps } from '.';
import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import {
  Checkbox,
  Input,
  Select,
} from '@core/design-system/library/vristo/source/components/Input';
import React, { useState, useEffect } from 'react';
import { ImageAnswer, InputAnswer, SoundAnswer } from '../../atom/InputAnswer';
import InputTranslate from '../../atom/InputTranslate';

const FormSorting = ({
  optionsAnswerSelect,
  optionsAnswerSelectCount,
  optionsAnswerSelectFakeCount,
  handleShowModalTranslate,
  handleChangeOptions,
  inputAnswerList,
  inputAnswerListFake,
  selectedCanReuseChoice,
  answerType,
}: FormAnswerSelectProps) => {
  const [checkedFake, setCheckedFake] = useState(false);

  const handleChangeAnswerType = (value: string) => {
    handleChangeOptions('answerType', value);
  };

  const optionDuplicateSelect = [
    { value: true, label: 'ใช้ซ้ำได้' },
    { value: false, label: 'ใช้ซ้ำไม่ได้' },
  ];

  useEffect(() => {
    if ((inputAnswerListFake?.length ?? 0) > 0) {
      setCheckedFake(true);
    } else {
      setCheckedFake(false);
    }
  }, [inputAnswerListFake]);

  return (
    <div className="flex flex-col gap-2">
      <Select
        className="mb-2"
        required
        label="รูปแบบตัวเลือกคำตอบ"
        options={optionsAnswerSelect}
        isSearchable={false}
        onChange={(e) => {
          if (!Array.isArray(e) && e && 'value' in e) {
            handleChangeAnswerType(e.value.toString() ?? '');
          }
        }}
        disabled
        value={optionsAnswerSelect?.find((option) => option.value === answerType)}
      />
      <div className="font-bold">ตัวเลือกคำตอบถูก</div>
      <div className="grid grid-cols-2 gap-2">
        <Select
          required
          label="จำนวนตัวเลือกคำตอบถูก"
          defaultValue={optionsAnswerSelectCount && optionsAnswerSelectCount[4]}
          options={optionsAnswerSelectCount}
          isSearchable={false}
          onChange={(e) => {
            if (!Array.isArray(e)) {
              if (e && 'value' in e) {
                handleChangeOptions('answerSelectCount', e.value.toString() ?? '');
              }
            }
          }}
          value={
            optionsAnswerSelectCount?.find(
              (option) => Number(option.value) === inputAnswerList?.length,
            ) || null
          }
        />
        <Select
          required
          label="ใช้ตัวเลือกตอบซ้ำ"
          options={optionDuplicateSelect}
          onChange={(e) => {
            if (!Array.isArray(e)) {
              if (e && 'value' in e) {
                handleChangeOptions('canReuseChoice', e.value.toString() ?? '');
              }
            }
          }}
          value={optionDuplicateSelect?.find(
            (option) => option.value === selectedCanReuseChoice,
          )}
        />
      </div>
      <div className="flex flex-col">
        {[...(inputAnswerList ?? [])]
          ?.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
          .map((inputAnswer, index) => (
            <React.Fragment key={index}>
              {(answerType === 'text-speech' || answerType === 'speech') && (
                <InputTranslate
                  key={index}
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
                  index={inputAnswer.index}
                  label={`ตัวเลือกคำตอบที่ ${inputAnswer.index}`}
                  handleChangeOptions={handleChangeOptions}
                  handleShowModalTranslate={handleShowModalTranslate}
                  keyAnswer="answer_"
                />
              )}

              {/* {answerType === 'speech' && (
                        <SoundAnswer
                            // inputAnswer={inputAnswer}
                            inputAnswer={{ value: '' }}
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
      <Checkbox
        label={<div className="font-bold">ตัวเลือกหลอก</div>}
        checked={checkedFake}
        onChange={(e) => {
          setCheckedFake(e.target.checked);
          if (!e.target.checked) {
            handleChangeOptions('answerSelectFakeCount', '');
          } else {
            handleChangeOptions('answerSelectFakeCount', '1');
          }
        }}
      />
      <div className="grid grid-cols-2 gap-2">
        <Select
          required
          label="จำนวนตัวเลือกหลอก"
          options={optionsAnswerSelectFakeCount}
          isSearchable={false}
          onChange={(e) => {
            if (!Array.isArray(e)) {
              if (e && 'value' in e) {
                handleChangeOptions('answerSelectFakeCount', e.value.toString() ?? '');
              }
            }
          }}
          disabled={!checkedFake}
          value={
            optionsAnswerSelectFakeCount?.find(
              (option) => Number(option.value) === inputAnswerListFake?.length,
            ) || null
          }
        />
      </div>
      {[...(inputAnswerListFake ?? [])]
        ?.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
        .map((inputAnswer, index) => (
          <React.Fragment key={index}>
            {(answerType === 'text-speech' || answerType === 'speech') && (
              <InputTranslate
                key={index}
                callback={(value) =>
                  handleChangeOptions('answer_fake_' + inputAnswer.index, '', value)
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
                inputAnswer={inputAnswer}
                index={inputAnswer.index}
                label={`ตัวเลือกคำตอบที่ ${inputAnswer.index}`}
                handleChangeOptions={handleChangeOptions}
                handleShowModalTranslate={handleShowModalTranslate}
                keyAnswer="answer_fake_"
              />
            )}

            {/* {answerType === 'speech' && (
                        <SoundAnswer
                            // inputAnswer={inputAnswer}
                            inputAnswer={{ value: '' }}
                            index={index}
                            handleChangeOptions={handleChangeOptions}
                            handleShowModalTranslate={handleShowModalTranslate}
                            keyAnswer="answer_fake_"
                        />
                    )} */}
          </React.Fragment>
        ))}
    </div>
  );
};

export default FormSorting;
