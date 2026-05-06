import StoreGlobal from '@global/store/global';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import API from '../local/api';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import Box from '../local/components/atom/Box';
import WizardBar from '../local/components/organism/WizardBar';
import { tabs } from '../local/components/template/Tab';
import { useState, useRef } from 'react';
import FooterForm from '../local/components/organism/FooterForm';
import { convertIdToThreeDigit } from '../local/util';
import {
  AcademicLevelLanguage,
  AcademicLevelStatusType,
  Question,
  RowData,
  TextDataTranslation,
  TextSaveDataTranslation,
  TextTranslation,
} from '../local/type';
import CWButton from '@component/web/cw-button';
import { ISubject } from '@domain/g02/g02-d02/local/type';
import StoreGlobalPersist from '@store/global/persist';
import HeaderBreadcrumbs from '../local/components/template/header-breadcrumbs';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const navigate = useNavigate();
  const { academicLevelId, subLessonId } = useParams({ from: '' });
  const { subjectData }: { subjectData: ISubject } = StoreGlobalPersist.StateGet([
    'subjectData',
  ]);
  const [academicLevel, setAcademicLevel] = useState<any>({});
  const [mainLanguage, setMainLanguage] =
    useState<AcademicLevelLanguage['language']>('en');
  const [language, setLanguage] = useState<AcademicLevelLanguage>();
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);

  const [rowData1, setRowData1] = useState<RowData[]>([]);
  const [rowData2, setRowData2] = useState<RowData[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<RowData[]>([]);
  const [loadingTranslate, setLoadingTranslate] = useState(false);

  const updateRowData = (key: string, value: string, textType: string) => {
    const language = key.split('_')[3];
    const newRowData1 = rowData1.map((item) => {
      if (item.key === textType) {
        return {
          ...item,
          ['language_' + language]: value,
        };
      }
      return item;
    });

    setRowData1(newRowData1);
  };

  const getQuestions = async () => {
    API.academicLevel.GetG02D05A29(academicLevelId, {}).then((res) => {
      if (res.status_code === 200) {
        const dataSort = res.data?.sort((a, b) => a.index - b.index);
        setQuestionsList(dataSort);
        if (res.data?.[0] && 'index' in res.data[0]) {
          if (typeof res.data[0].index === 'number' && selectedQuestion === null) {
            const dataindex1 = res.data.find((item) => item.index === 1);
            setSelectedQuestion(dataindex1 as Question);
          }
        }
      }
    });
  };

  const generateRowData = (
    id: number,
    key: string,
    topic: string,
    textData: TextTranslation | undefined,
  ) => ({
    id,
    key,
    topic,
    saved_text_group_id: textData?.saved_text_group_id || '',
    language_th: textData?.translations?.['th']?.text || '',
    language_en: textData?.translations?.['en']?.text || '',
    language_zh: textData?.translations?.['zh']?.text || '',
  });

  const setNewTextTranslation = (
    data: {
      saved_text_group_id: string;
      translations: { [key: string]: string };
    }[],
  ) => {
    const updateRecords = (records: RowData[]) => {
      return records.map((record) => {
        const newRecord = { ...record };
        const found = data.find(
          (item) => item.saved_text_group_id === record.saved_text_group_id,
        );
        if (found) {
          Object.keys(found.translations).forEach((lang) => {
            if (lang !== mainLanguage) {
              newRecord[`language_${lang}`] = found.translations[lang];
            }
          });
        }
        return newRecord;
      });
    };

    const newRecords1 = updateRecords(rowData1);
    const newRecords2 = updateRecords(rowData2);

    setRowData1(newRecords1);
    setRowData2(newRecords2);
  };

  const handleChange = (key: string, value: string) => {
    console.log('handleChange', key, value);

    if (/^description_text_language_/.test(key)) {
      updateRowData(key, value, 'description_text');
    } else if (/^command_text_language_/.test(key)) {
      updateRowData(key, value, 'command_text');
    } else if (/^hint_text_language_/.test(key)) {
      updateRowData(key, value, 'hint_text');
    } else if (/^group_/.test(key)) {
      const groupIndex = key.split('_')[1];
      const keySplit = key.split(`group_${groupIndex}_`)[1];

      setRowData1((prev) =>
        prev.map((item) => {
          if (key.startsWith(item.key)) {
            item[keySplit] = value;
          }
          return item;
        }),
      );
    } else if (/^choice_/.test(key)) {
      const choiceIndex = key.split('_')[1];
      const keySplit = key.split(`choice_${choiceIndex}_`)[1];

      setRowData2((prev) =>
        prev.map((item) => {
          if (key.startsWith(item.key)) {
            item[keySplit] = value;
          }
          return item;
        }),
      );
    }
  };

  const handleClickQuestion = (action: string) => {
    if (!selectedQuestion) return;

    const currentIndex = selectedQuestion.index;
    const maxIndex = questionsList.length;

    setSelectedRecords([]);
    switch (action) {
      case 'next':
        if (currentIndex < maxIndex) {
          const nextQuestion = questionsList.find(
            (item) => item.index === currentIndex + 1,
          );
          if (nextQuestion) {
            setSelectedQuestion(nextQuestion);
          }
        }
        break;
      case 'prev':
        if (currentIndex > 1) {
          const prevQuestion = questionsList.find(
            (item) => item.index === currentIndex - 1,
          );
          if (prevQuestion) {
            setSelectedQuestion(prevQuestion);
          }
        }
        break;
      default:
        break;
    }
  };

  const handlePrevious = async () => {
    setLoading(true);
    const result = await SubmitOn();
    if (result) {
      navigate({
        to: `/content-creator/level/${subLessonId}/create-question/${academicLevel.id}`,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    console.log('handleSave');
    const result = await SubmitOn();
  };

  const handleNext = async () => {
    console.log('handleNext');
    const result = await SubmitOn();
    if (result) {
      if (academicLevel.id) {
        navigate({
          to: `/content-creator/level/${subLessonId}/create-sound/${academicLevel.id}`,
        });
      }
    }
  };

  const handleClickTranslate = async () => {
    console.log('handleClickTranslate');

    setLoadingTranslate(true);
    const data: { text: TextDataTranslation[] } = {
      text: [],
    };

    let destLanguages = ['th', 'en', 'zh'];
    const srcLanguage = mainLanguage;

    destLanguages = destLanguages.filter((lang) => lang !== srcLanguage);

    selectedRecords.forEach((record) => {
      data.text.push({
        saved_text_group_id: record.saved_text_group_id,
        src_language: srcLanguage,
        src_text: record['language_' + srcLanguage] as string,
        dest_languages: destLanguages,
      });
    });

    if (selectedQuestion) {
      return API.academicLevel
        .CreateG02D05A51(String(selectedQuestion?.id), data)
        .then((res) => {
          setLoadingTranslate(false);
          if (res.status_code === 200) {
            const translationsData = res.data.map((item: any) => ({
              saved_text_group_id: item.saved_text_group_id,
              translations: item.translations,
            }));
            setNewTextTranslation(translationsData);
            showMessage('แปลภาษาสำเร็จ', 'success');
            return true;
          } else {
            showMessage(res.message, 'error');
            return false;
          }
        });
    } else {
      return false;
    }
  };

  const updateLevel = async () => {
    const dataLevel = {
      wizard_index: 3,
      status: 'translation' as keyof typeof AcademicLevelStatusType,
    };

    if (academicLevel?.wizard_index > dataLevel.wizard_index) {
      dataLevel.wizard_index = academicLevel.wizard_index;
      dataLevel.status = academicLevel.status;
    }

    API.academicLevel.Update(academicLevelId, dataLevel).then((res) => {
      if (res.status_code === 200) {
        setAcademicLevel(res.data?.[0]);
        return true;
      } else {
        showMessage(res.message, 'error');
        return false;
      }
    });
  };

  const SubmitOn = async () => {
    console.log('SubmitOn');

    setLoading(true);

    const data: { text: TextSaveDataTranslation[] } = {
      text: [],
    };

    const addRecordToData = (record: RowData) => {
      if (!record.saved_text_group_id) {
        return; // Skip if saved_text_group_id is not present
      }

      const newRecord: TextSaveDataTranslation = {
        saved_text_group_id: record.saved_text_group_id,
      };

      if (record.language_th !== '') {
        newRecord.thai_text = record.language_th;
      }
      if (record.language_en !== '') {
        newRecord.english_text = record.language_en;
      }
      if (record.language_zh !== '') {
        newRecord.chinese_text = record.language_zh;
      }

      data.text.push(newRecord);
    };

    rowData1.forEach((record) => {
      addRecordToData(record);
    });

    rowData2.forEach((record) => {
      addRecordToData(record);
    });

    updateLevel();

    return API.academicLevel
      .CreateG02D05A52(String(selectedQuestion?.id), data)
      .then((res) => {
        setLoading(false);
        if (res.status_code === 200) {
          showMessage('บันทึกสำเร็จ', 'success');
          getQuestions();
          return true;
        } else {
          showMessage(res.message, 'error');
          return false;
        }
      });
  };

  useEffect(() => {
    if (academicLevelId) {
      API.academicLevel.GetById(academicLevelId).then((res) => {
        if (res.status_code === 200) {
          setAcademicLevel(res.data?.[0]);
        }
      });

      getQuestions();
    }
  }, [academicLevelId]);

  useEffect(() => {
    if (academicLevel) {
      if (academicLevel?.language?.language) {
        setMainLanguage(academicLevel.language.language);
        setLanguage(academicLevel.language);
      }
    }
  }, [academicLevel]);

  useEffect(() => {
    const commandText = selectedQuestion?.command_text;
    const descriptionText = selectedQuestion?.description_text;
    const hintText = selectedQuestion?.hint_text;
    const textChoices = selectedQuestion?.text_choices;

    // pairing
    const groups = selectedQuestion?.groups;

    const newRowData1: RowData[] = [
      generateRowData(1, 'command_text', 'คำสั่ง', commandText),
      generateRowData(2, 'description_text', 'โจทย์', descriptionText),
      generateRowData(3, 'hint_text', 'คำใบ้', hintText),
    ];

    const newRowData2: RowData[] = [];

    if (groups) {
      groups.forEach((item, index) => {
        if ('translations' in item) {
          const translations = item.translations;
          const saved_text_group_id = item.saved_text_group_id;
          const key = `group_${item.index}`;

          newRowData1.push({
            id: index + 4,
            key,
            topic: `กลุ่มที่ ${item.index}`,
            saved_text_group_id,
            language_th: translations['th']?.text || '',
            language_en: translations['en']?.text || '',
            language_zh: translations['zh']?.text || '',
          });
        }
      });
    }

    if (textChoices) {
      textChoices.forEach((item, index) => {
        if ('translations' in item) {
          const translations = item.translations;
          const saved_text_group_id = item.saved_text_group_id;
          const key = `choice_${item.index}`;

          newRowData2.push({
            id: index + newRowData1.length + 1,
            key,
            topic: `ตัวเลือกคำตอบที่ ${item.index}`,
            saved_text_group_id,
            language_th: translations['th']?.text || '',
            language_en: translations['en']?.text || '',
            language_zh: translations['zh']?.text || '',
          });
        }
      });
    }

    setRowData2(newRowData2);
    setRowData1(newRowData1);
  }, [selectedQuestion, mainLanguage]);

  useEffect(() => {
    console.log('selectedRecords', selectedRecords);
  }, [selectedRecords]);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <LayoutDefault>
      <HeaderBreadcrumbs
        links={[
          {
            label: 'เกี่ยวกับหลักสูตร',
            href: `/content-creator/sublesson/${subjectData.id}`,
          },
          { label: 'จัดการด่าน', href: `/content-creator/level/${subLessonId}` },
          { label: academicLevelId ? 'แก้ไขด่าน' : 'เพิ่มบทเรียนหลัก', href: '' },
        ]}
        headerTitle={academicLevelId ? 'แก้ไขด่าน' : 'เพิ่มบทเรียนหลัก'}
        headerDescription={<div>ID: {convertIdToThreeDigit(academicLevelId)}</div>}
        sublessonId={subLessonId}
        backLink={`/content-creator/level/${subLessonId}`}
      />
      <div className="mt-5 flex w-full flex-col gap-6 font-noto-sans-thai">
        <Box className="w-full rounded-lg bg-white p-5 shadow-md">
          <WizardBar tabs={tabs} activeId={3} />
        </Box>
        <Box className="flex flex-col gap-4">
          <Box className="flex flex-col items-center justify-center gap-2 bg-[#EAF1FF]">
            <div className="text-xl font-bold">ระบบช่วยแปลภาษาด้วย AI</div>
            <div>กรุณากดบันทึก เพื่อยืนยันการแปลภาษาและบันทึกข้อมูล</div>
            <div className="flex gap-4">
              <CWButton
                className="btn btn-primary h-10 w-40"
                onClick={handleClickTranslate}
                type="button"
                title="แปลภาษาด้วย AI"
                loading={loadingTranslate}
              />
              <Link
                to={`/content-creator/level/${subLessonId}/create-sound/${academicLevel.id}`}
                className="btn btn-outline-primary w-40 bg-white"
              >
                ข้ามขั้นตอนนี้
              </Link>
            </div>
          </Box>
          <div className="flex items-center justify-center gap-4 rounded-sm bg-gray-100 py-4 text-lg font-bold">
            <div>คำถามข้อที่</div>
            <button
              className="btn btn-primary h-11 w-11 !p-0"
              onClick={() => handleClickQuestion('prev')}
              type="button"
            >
              <IconCaretDown className="h-6 w-6 rotate-90" />
            </button>
            <div className="flex items-center gap-4">
              <div>{selectedQuestion?.index}</div>
              <div>/ {questionsList.length}</div>
            </div>
            <button
              className="btn btn-primary h-11 w-11 !p-0"
              onClick={() => handleClickQuestion('next')}
              type="button"
            >
              <IconCaretDown className="h-6 w-6 -rotate-90" />
            </button>
          </div>
          <div className="datatables">
            <Table1
              title="โจทย์"
              rowData={rowData1}
              mainLanguage={mainLanguage}
              handleChange={handleChange}
              selectedRecords={selectedRecords}
              setSelectedRecords={setSelectedRecords}
            />
          </div>
          <div className="datatables">
            <Table1
              title="เฉลย"
              rowData={rowData2}
              mainLanguage={mainLanguage}
              handleChange={handleChange}
              selectedRecords={selectedRecords}
              setSelectedRecords={setSelectedRecords}
            />
          </div>
        </Box>
        <Box className="flex w-full justify-between rounded-lg bg-[#F5F5F5] p-5 shadow-md">
          <FooterForm
            academicLevel={academicLevel}
            onNext={handleNext}
            onSave={handleSave}
            onPrevious={handlePrevious}
            loading={loading}
          />
        </Box>
      </div>
    </LayoutDefault>
  );
};

const Table1 = ({
  rowData,
  mainLanguage,
  handleChange,
  selectedRecords,
  setSelectedRecords,
  title,
}: {
  rowData: RowData[];
  mainLanguage: string;
  handleChange: (key: string, value: string) => void;
  selectedRecords: RowData[];
  setSelectedRecords: (value: RowData[]) => void;
  title?: string;
}) => {
  const [languageOrders, setLanguageOrders] = useState<string[]>([
    'language_th',
    'language_en',
    'language_zh',
  ]);

  const getTitle = (language: string) => {
    const lang = language.split('_')[1];
    switch (lang) {
      case 'th':
        return mainLanguage === 'th' ? 'ภาษาไทย (ค่าเริ่มต้น)' : `ภาษาไทย`;
      case 'en':
        return mainLanguage === 'en' ? 'ภาษาอังกฤษ (ค่าเริ่มต้น)' : `ภาษาอังกฤษ`;
      case 'zh':
        return mainLanguage === 'zh' ? 'ภาษาจีน (ค่าเริ่มต้น)' : `ภาษาจีน`;
      default:
        return '';
    }
  };

  const getRenderCell = (language: string) => {
    // if language is main language, return readonly
    const lang = language.split('_')[1];
    if (mainLanguage === lang) {
      return (record: Record<string, unknown>, index: number) => (
        <div className="text-wrap">{(record as RowData)[language] as string}</div>
      );
    }

    // if language is not main language, return textarea
    return (record: Record<string, unknown>, index: number) => (
      <textarea
        rows={1}
        className="form-textarea"
        placeholder="Language translation..."
        required
        value={(record as RowData)[language] as string | ''}
        onInput={(e) => {
          // handleChange(`description_text_${language}`, e.currentTarget.value);
          handleChange(
            `${(record as RowData)['key']}_${language}`,
            e.currentTarget.value,
          );
        }}
        onChange={() => {}}
      />
    );
  };

  const getTextMainLanguage = (record: Record<string, unknown>) => {
    return (record as RowData)[`language_${mainLanguage}`] as string;
  };

  const rowColumns: DataTableColumn[] = [
    {
      accessor: 'topic',
      title: title,
    },
    {
      accessor: languageOrders[0],
      width: 450,
      title: getTitle(languageOrders[0]),
      render: getRenderCell(languageOrders[0]),
    },
    {
      accessor: languageOrders[1],
      title: getTitle(languageOrders[1]),
      width: 450,
      render: getRenderCell(languageOrders[1]),
    },
    {
      accessor: languageOrders[2],
      title: getTitle(languageOrders[2]),
      width: 450,
      render: getRenderCell(languageOrders[2]),
    },
  ];

  useEffect(() => {
    const newLanguageOrders = languageOrders.sort((a, b) => {
      if (a.includes(mainLanguage)) return -1;
      if (b.includes(mainLanguage)) return 1;
      return 0;
    });

    setLanguageOrders(newLanguageOrders);
  }, [mainLanguage]);

  return (
    <DataTable
      minHeight={300}
      className="table-hover whitespace-nowrap"
      records={rowData}
      columns={rowColumns}
      selectedRecords={rowData.length > 0 ? selectedRecords : []}
      onSelectedRecordsChange={setSelectedRecords}
      highlightOnHover
      withTableBorder
      withColumnBorders
      isRecordSelectable={(record) => {
        return !!getTextMainLanguage(record);
      }}
    />
  );
};

export default DomainJSX;
