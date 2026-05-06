import React, { useEffect, useState } from 'react';

import CWInput from '@component/web/cw-input';
import { SubjectLessons } from '@domain/g02/g02-d03/local/Type';
import CWNeutralBox from '@component/web/cw-neutral-box';
import {
  optionAccessibility,
  optionFontFamily,
  optionFontsize,
} from '@domain/g02/g02-d03/local/components/option';
import WCADropdown from '@domain/g02/g02-d03/local/components/organisms/WCADropdown';
interface InfoLesson {
  nameSet: (e: string) => void;
  name?: string;
  id?: number;
  editMode?: boolean;
  data?: SubjectLessons[];
  fontNameValue?: string;
  fontSizeValue?: string;
  onSelectedFontSize?: (selectedFontSize: { value: string; label: string }) => void;
  onSelectedFontFamily?: (selectedFontFamily: { value: string; label: string }) => void;
  onSelectedExtra?: (selectedExtra: { value: string; label: string }) => void;
}
const InfoLesson = ({
  nameSet,
  name,
  id,
  editMode,
  fontNameValue,
  fontSizeValue,
  onSelectedFontSize,
  onSelectedFontFamily,
  onSelectedExtra,
}: InfoLesson) => {
  const [selectedFontFamily, setSelectedFontFamily] = useState(fontNameValue);
  const [selectedFontSize, setSelectedFontSize] = useState(fontSizeValue);
  useEffect(() => {
    if (fontNameValue) {
      setSelectedFontFamily(fontNameValue);
    }
    if (fontSizeValue) {
      setSelectedFontSize(fontSizeValue);
    }
  }, [fontNameValue, fontSizeValue]);
  const handleFontFamilyChange = (selectedValue: string) => {
    setSelectedFontFamily(selectedValue);
    onSelectedFontFamily?.({ value: selectedValue, label: selectedValue });
  };

  const handleFontSizeChange = (selectedValue: string) => {
    setSelectedFontSize(selectedValue);
    onSelectedFontSize?.({ value: selectedValue, label: selectedValue });
  };

  const [lessonName, setLessonName] = useState(name?.replace(' (extra)', '') || '');
  const [selectedExtra, setSelectedExtra] = useState(
    name?.includes('(extra)') ? '(extra)' : '',
  );

  const handleExtra = (selectedValue: string) => {
    setSelectedExtra(selectedValue);
    onSelectedExtra?.({ value: selectedValue, label: selectedValue });

    nameSet(selectedValue ? `${lessonName} ${selectedValue}` : lessonName);
  };

  useEffect(() => {
    if (name) {
      if (name.includes('(extra)')) {
        setLessonName(name.replace(' (extra)', ''));
        setSelectedExtra('(extra)');
      } else {
        setLessonName(name);
        setSelectedExtra('');
      }
    }
  }, [name]);
  return (
    <div>
      <div className="w-full">
        <div className="flex gap-5">
          <CWInput
            className="col-span-2 w-full"
            label="ชื่อบทเรียนหลัก"
            required
            value={lessonName}
            onChange={(e) => {
              const newName = e.target.value || '';
              setLessonName(newName);

              nameSet(selectedExtra ? `${newName} ${selectedExtra}` : newName);
            }}
          />
          <div className="flex w-full flex-col gap-[7px]">
            <div className="flex">
              <span className="text-red-500">*</span>
              <p className="text-[14px]">ประเภทการเข้าถึง:</p>
            </div>
            <WCADropdown
              placeholder={
                optionAccessibility.find((option) => option.value === selectedExtra)
                  ?.label || 'เลือกประเภทการเข้าถึง'
              }
              options={optionAccessibility}
              onSelect={(selectedValue) => {
                handleExtra(selectedValue);

                nameSet(selectedValue ? `${lessonName} ${selectedValue}` : lessonName);
              }}
            />
          </div>
        </div>

        <div className="mt-5 w-full px-2 pt-3">
          <div className="border-b-2 pb-5">
            <h1 className="text-[24px] font-bold">ตั้งค่าตัวอักษร</h1>
            <p className="mt-3 text-gray-500">
              การตั้งค่านี้จะเป็นค่าการแสดงผลเริ่มต้นของด่านทุกด่านที่อยู่ภายใต้บทเรียนหลักนี้{' '}
            </p>
          </div>
          <div>
            <div className="flex gap-10">
              <div className="w-full py-3">
                <div className="flex flex-col gap-2">
                  <div className="flex">
                    <span className="text-red-500">*</span>
                    <p className="text-[14px]">รูปแบบตัวอักษร (ค่าเริ่มต้น):</p>
                  </div>

                  <WCADropdown
                    placeholder={
                      optionFontFamily.find(
                        (option) => option.value === selectedFontFamily,
                      )?.label || 'เลือกรูปแบบตัวอักษร'
                    }
                    options={optionFontFamily}
                    onSelect={handleFontFamilyChange}
                  />
                </div>
              </div>
              <div className="w-full py-3">
                <div className="flex flex-col gap-2">
                  <div className="flex">
                    <span className="text-red-500">*</span>
                    <p className="text-[14px]">ขนาดตัวอักษร (ค่าเริ่มต้น):</p>
                  </div>

                  <WCADropdown
                    placeholder={
                      optionFontsize.find((option) => option.value === selectedFontSize)
                        ?.label || 'เลือกขนาดตัวอักษร'
                    }
                    options={optionFontsize}
                    onSelect={handleFontSizeChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <CWNeutralBox className="mt-4 h-auto">
            <h1
              style={{
                fontSize: selectedFontSize,
                fontFamily:
                  selectedFontFamily === 'noto-sans-thai'
                    ? 'Noto Sans Thai, sans-serif'
                    : selectedFontFamily === 'san'
                      ? 'Arial, sans-serif'
                      : 'Times New Roman, serif',
              }}
              className="py-3"
            >
              "ตัวอย่างการแสดงผลตัวอักษร {selectedFontSize}"
            </h1>
          </CWNeutralBox>
        </div>
      </div>
    </div>
  );
};

export default InfoLesson;
