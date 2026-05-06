import { FormAnswerSelectProps } from '.';
import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import {
  Input,
  Select,
} from '@core/design-system/library/vristo/source/components/Input';
import React, { useState } from 'react';
import { ImageAnswer, InputAnswer, SoundAnswer } from '../../atom/InputAnswer';
import InputTranslate from '../../atom/InputTranslate';

const FormPairing = ({
  optionGroupCount,
  optionsAnswerSelect,
  optionsAnswerSelectCount,
  optionsAnswerSelectFakeCount,
  handleChangeOptions,
  handleShowModalTranslate,
  inputAnswerGroupList,
  inputAnswerList,
  inputAnswerListFake,
  selectedCanReuseChoice,
  answerType,
}: FormAnswerSelectProps) => {
  const handleChangeAnswerType = (value: string) => {
    // setAnswerType(value);
    handleChangeOptions('answerType', value);
  };

  const optionDuplicateSelect = [
    { value: true, label: 'ใช้ซ้ำได้' },
    { value: false, label: 'ใช้ซ้ำไม่ได้' },
  ];
  return (
    <div className="flex flex-col gap-2">
      <div className="font-bold">กลุ่มคำตอบ</div>
      <Select
        className="w-1/2"
        required
        label="จำนวนกลุ่ม"
        options={optionGroupCount}
        onChange={(value) => {
          handleChangeOptions('groupCount', value.value);
        }}
        value={optionGroupCount?.find(
          (option) =>
            inputAnswerGroupList && Number(option.value) === inputAnswerGroupList.length,
        )}
      />
      {inputAnswerGroupList &&
        inputAnswerGroupList.map((item, index) => (
          <InputTranslate
            key={index}
            callback={(value) =>
              handleChangeOptions('answer_group_' + item.index, '', value)
            }
            handleShowModalTranslate={handleShowModalTranslate}
            label={`ชื่อกลุ่ม #${item.index}`}
            placeholder="กรุณาเลือกคำตอบ"
            required
            value={item}
          />
        ))}
      <Divider />
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
        value={optionsAnswerSelect?.find((option) => option.value === answerType)}
      />
      <div className="font-bold">ตัวเลือกคำตอบถูก</div>
      <div className="grid grid-cols-2 gap-2">
        <Select
          required
          label="จำนวนตัวเลือกคำตอบถูก"
          options={optionsAnswerSelectCount}
          isSearchable={false}
          onChange={(e) => {
            if (!Array.isArray(e)) {
              if (e && 'value' in e) {
                handleChangeOptions('answerSelectCount', e.value.toString() ?? '');
              }
            }
          }}
          value={optionsAnswerSelectCount?.find(
            (option) => Number(option.value) === inputAnswerList?.length,
          )}
        />
        <Select
          required
          label="ใช้ตัวเลือกตอบซ้ำ"
          // defaultValue={optionDuplicateSelect[0]}
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
                  label={`ตัวเลือกคำตอบที่ ${inputAnswer.index}`}
                  index={inputAnswer.index}
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
      <div className="font-bold">ตัวเลือกหลอก</div>
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
          value={optionsAnswerSelectFakeCount?.find(
            (option) => Number(option.value) === inputAnswerListFake?.length,
          )}
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
                label={`ตัวเลือกหลอกที่ ${inputAnswer.index}`}
                placeholder="กรุณาเลือกคำตอบ"
                required
                value={inputAnswer}
              />
            )}

            {answerType === 'image' && (
              <ImageAnswer
                inputAnswer={inputAnswer}
                index={inputAnswer.index}
                label={`ตัวเลือกหลอกที่ ${inputAnswer.index}`}
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

export default FormPairing;
