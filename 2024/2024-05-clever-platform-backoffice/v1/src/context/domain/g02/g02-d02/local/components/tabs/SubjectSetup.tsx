import CWInputRadio from '@component/web/cw-input-radio';
import { ISubject } from '../../type';
import { useEffect, useRef, useState } from 'react';
import CWSelect from '@component/web/cw-select';
import CWInputCheckbox from '@component/web/cw-input-checkbox';

const TSubjectSetup = ({
  subject,
  onDataChange,
}: {
  subject?: ISubject;
  onDataChange(data: {
    subject_language_type: string;
    subject_language: string;
    subject_translation_languages: string[];
  }): void;
}) => {
  const languages = [
    {
      label: 'ภาษาไทย',
      value: 'th',
    },
    {
      label: 'ภาษาอังกฤษ',
      value: 'en',
    },
    {
      label: 'ภาษาจีน',
      value: 'zh',
    },
  ];

  const [configType, setConfigType] = useState(subject?.subject_language_type ?? '');
  const [language, setLanguage] = useState(subject?.subject_language ?? '');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    subject?.subject_translation_languages ?? [],
  );
  const configTypes = [
    {
      label: 'อนุญาตให้สร้างเนื้อหาทุกภาษา',
      value: 'all',
      inputLabel: 'ภาษาหลัก',
    },
    {
      label: 'อนุญาตให้สร้างเนื้อหาแค่ภาษาเดียว',
      value: 'uni',
      inputLabel: 'ภาษาหลักที่ใช้เรียน',
    },
    {
      label: 'ตั้งค่าเอง',
      value: 'custom',
      inputLabel: 'ภาษาหลักที่ใช้เรียน',
    },
  ];

  useEffect(() => {
    onDataChange({
      subject_language_type: configType,
      subject_language: language,
      subject_translation_languages: selectedLanguages,
    });
  }, [configType, language, selectedLanguages]);

  const configTypeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = configTypeRef.current?.getElementsByTagName('input') ?? [];
    for (let el of els) {
      if (el.value == configType) {
        el.checked = true;
      }
    }
  }, [subject]);

  return (
    <div className={`flex h-fit w-full flex-col gap-2 rounded-md bg-white p-4 shadow-md`}>
      <div className="font-bold">ค่าเริ่มต้นภาษาของบทเรียน</div>
      <div className="flex flex-col gap-2" ref={configTypeRef}>
        {configTypes.map((config) => (
          <div key={`config_${config.value}`}>
            <CWInputRadio
              name="config_type"
              value={config.value}
              label={config.label}
              required
              checked={config.value == configType}
              onChange={(e) => {
                setConfigType(e.currentTarget.value);
                setLanguage('');
                setSelectedLanguages([]);
              }}
            />
            <div className="ms-8">
              <CWSelect
                label={config.inputLabel}
                value={config.value == configType ? language : ''}
                disabled={config.value != configType}
                options={languages}
                required
                onChange={(e) => {
                  setLanguage(e.currentTarget.value);
                }}
              />
              {config.value == 'custom' && (
                <div className="mt-2 flex flex-col flex-wrap gap-2">
                  <div className="font-bold">การแปลภาษา</div>
                  <div className="flex gap-8">
                    {languages.map((lang) => (
                      <CWInputCheckbox
                        key={`custom_lang_${lang.value}`}
                        name="custom_lang"
                        value={lang.value}
                        label={lang.label}
                        className="*:font-normal"
                        checked={selectedLanguages.includes(lang.value)}
                        disabled={config.value != configType}
                        onChange={(e) => {
                          const checked = e.currentTarget.checked;
                          const value = e.currentTarget.value;
                          setSelectedLanguages((prev) => {
                            if (checked == true) {
                              if (!prev.includes(value)) prev = [...prev, value];
                            } else {
                              prev = prev.filter((p) => p != value);
                            }
                            return [...prev];
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TSubjectSetup;
