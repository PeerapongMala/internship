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
  TextDataTranslationSound,
  TextSaveDataTranslation,
  TextTranslation,
} from '../local/type';
import { Select } from '@core/design-system/library/vristo/source/components/Input';
import ComponentSound from '../g02-d05-p02-content-question/components/molecule/ComponentSound';
import { Modal } from '@core/design-system/library/vristo/source/components/Modal';
import IconSpeaker from '@core/design-system/library/component/icon/IconSpeaker';
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
  const optionLanguage = [
    { value: 'th', label: 'ภาษาไทย' },
    { value: 'en', label: 'ภาษาอังกฤษ' },
    { value: 'zh', label: 'ภาษาจีน' },
  ];

  const [academicLevel, setAcademicLevel] = useState<any>({});
  const [mainLanguage, setMainLanguage] =
    useState<AcademicLevelLanguage['language']>('en');
  const [selectedlanguage, setSelectedLanguage] = useState<{
    value: string;
    label: string;
  }>();

  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);

  const [rowData1, setRowData1] = useState<RowData[]>([]);
  const [rowData2, setRowData2] = useState<RowData[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<RowData[]>([]);
  const [selectedDelete, setSelectedDelete] = useState<{
    saved_text_group_id: string;
    text: string;
    lang: string;
  }>();
  const [beforeSave, setBeforeSave] = useState<TextDataTranslationSound[]>([]);
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
  const [loadingSound, setLoadingSound] = useState(false);

  const getQuestions = async () => {
    API.academicLevel.GetG02D05A29(academicLevelId, {}).then((res) => {
      if (res.status_code === 200) {
        const dataSort = res.data?.sort((a, b) => a.index - b.index);
        setQuestionsList(dataSort);
        if (res.data?.[0] && 'index' in res.data[0]) {
          if (typeof res.data[0].index === 'number' && selectedQuestion === null) {
            const dataindex1 = res.data.find((item) => item.index === 1);
            setSelectedQuestion(dataindex1 as Question);
          } else {
            const selected = res.data.find(
              (item) => item.index === selectedQuestion?.index,
            );
            console.log('getQuestions setSelectedQuestion');
            setSelectedQuestion(selected as Question);
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
    text_to_ai_th: textData?.translations?.['th']?.text_to_ai || '',
    text_to_ai_en: textData?.translations?.['en']?.text_to_ai || '',
    text_to_ai_zh: textData?.translations?.['zh']?.text_to_ai || '',
    language_th: textData?.translations?.['th']?.text || '',
    language_en: textData?.translations?.['en']?.text || '',
    language_zh: textData?.translations?.['zh']?.text || '',
    speech_url_th: textData?.translations?.['th']?.speech_url || '',
    speech_url_en: textData?.translations?.['en']?.speech_url || '',
    speech_url_zh: textData?.translations?.['zh']?.speech_url || '',
  });

  const setNewTextTranslation = (
    data: {
      saved_text_group_id: string;
      text_to_ai: string;
      language: string;
    }[],
    rowData: RowData[],
  ) => {
    console.log('setNewTextTranslation', data);

    const updateRecords = (records: RowData[]) => {
      return records.map((record) => {
        const newRecord = { ...record };
        const found = data.find(
          (item) => item.saved_text_group_id === record.saved_text_group_id,
        );
        if (found) {
          newRecord[`text_to_ai_${found.language}`] = found.text_to_ai;
        }
        return newRecord;
      });
    };

    return updateRecords(rowData);
  };

  const handleChange = (key: string, value: string) => {
    console.log('handleChange', key, value);

    if (/^description_text_/.test(key)) {
      const keySplit = key.split('description_text_')[1];

      setRowData1((prev) =>
        prev.map((item) => {
          if (item.key === 'description_text') {
            item[keySplit] = value;
          }
          return item;
        }),
      );
    } else if (/^command_text_/.test(key)) {
      const keySplit = key.split('command_text_')[1];

      setRowData1((prev) =>
        prev.map((item) => {
          if (item.key === 'command_text') {
            item[keySplit] = value;
          }
          return item;
        }),
      );
    } else if (/^hint_text_/.test(key)) {
      const keySplit = key.split('hint_text_')[1];

      setRowData1((prev) =>
        prev.map((item) => {
          if (item.key === 'hint_text') {
            item[keySplit] = value;
          }
          return item;
        }),
      );
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

  const handleDelete = async (
    saved_text_group_id: string,
    text: string,
    lang: string,
  ) => {
    if (!saved_text_group_id) {
      showMessage(
        'ไม่สามารถลบข้อมูลนี้ได้ เนื่องจากไม่มี saved_text_group_id',
        'warning',
      );
      return;
    }
    setSelectedDelete({ saved_text_group_id, lang, text });
    setShowModalConfirmDelete(true);
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
    console.log('handlePrevious');
    setLoading(true);
    const result = await SubmitOn();
    if (result) {
      navigate({
        to: `/content-creator/level/${subLessonId}/create-translate/${academicLevel.id}`,
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
          to: `/content-creator/level/${subLessonId}/create-public/${academicLevel.id}`,
        });
      }
    }
  };

  const handleClickCreateSound = async () => {
    console.log('handleClickCreateSound');
    setLoadingSound(true);
    const data: { text: TextDataTranslationSound[] } = {
      text: [],
    };

    const allRowData = [...rowData1, ...rowData2];

    const adminLoginAs: string = '';

    selectedRecords.forEach((record) => {
      if (!selectedlanguage) {
        return;
      }
      const recordData = allRowData.find((item) => item.id === record.id);
      if (!recordData) {
        return;
      }
      data.text.push({
        saved_text_group_id: recordData.saved_text_group_id,
        language: selectedlanguage.value,
        text_to_ai: recordData['text_to_ai_' + selectedlanguage.value] as string,
        ...(adminLoginAs && { admin_login_as: adminLoginAs }),
      });
    });

    if (selectedQuestion) {
      return API.academicLevel
        .CreateG02D05A53(String(selectedQuestion?.id), data)
        .then((res) => {
          setLoadingSound(false);
          if (res.status_code === 200) {
            showMessage('สร้างเสียงสำเร็จ', 'success');
            getQuestions();
            // setNewTextTranslation(data.text);
            setBeforeSave(data.text);
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
      wizard_index: 4,
      status: 'speech' as keyof typeof AcademicLevelStatusType,
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

    const data: { text: TextDataTranslationSound[] } = {
      text: [],
    };

    const addRecordToData = (record: RowData) => {
      if (!record.saved_text_group_id) {
        return;
      }

      const adminLoginAs: string = '';

      if (record.language_th) {
        const newRecordTh: TextDataTranslationSound = {
          saved_text_group_id: record.saved_text_group_id,
          language: 'th',
          text_to_ai: record.text_to_ai_th || '',
          ...(adminLoginAs && { admin_login_as: adminLoginAs }),
        };
        data.text.push(newRecordTh);
      }

      if (record.language_en) {
        const newRecordEn: TextDataTranslationSound = {
          saved_text_group_id: record.saved_text_group_id,
          language: 'en',
          text_to_ai: record.text_to_ai_en || '',
          ...(adminLoginAs && { admin_login_as: adminLoginAs }),
        };
        data.text.push(newRecordEn);
      }

      if (record.language_zh) {
        const newRecordZh: TextDataTranslationSound = {
          saved_text_group_id: record.saved_text_group_id,
          language: 'zh',
          text_to_ai: record.text_to_ai_zh || '',
          ...(adminLoginAs && { admin_login_as: adminLoginAs }),
        };
        data.text.push(newRecordZh);
      }
    };

    rowData1.forEach((record) => {
      addRecordToData(record);
    });

    rowData2.forEach((record) => {
      addRecordToData(record);
    });

    updateLevel();

    return API.academicLevel
      .CreateG02D05A54(String(selectedQuestion?.id), data)
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

  const SubmitDelete = async () => {
    if (selectedDelete) {
      setLoading(true);
      const data = {
        language: selectedDelete?.lang,
      };
      return API.academicLevel
        .DeleteG02D05A45(selectedDelete?.saved_text_group_id, data)
        .then((res) => {
          setLoading(false);
          if (res.status_code === 200) {
            showMessage('ลบข้อความเสียงสำเร็จ', 'success');
            setShowModalConfirmDelete(false);
            getQuestions();
            return true;
          } else {
            setShowModalConfirmDelete(false);
            showMessage(res.message, 'error');
            return false;
          }
        });
    }
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
        setSelectedLanguage(
          optionLanguage.find((item) => item.value === academicLevel.language.language),
        );
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

    let newRowData1: RowData[] = [
      generateRowData(1, 'command_text', 'คำสั่ง', commandText),
      generateRowData(2, 'description_text', 'โจทย์', descriptionText),
      generateRowData(3, 'hint_text', 'คำใบ้', hintText),
    ];

    if (
      selectedQuestion?.question_type === 'placeholder' &&
      selectedQuestion?.descriptions
    ) {
      selectedQuestion.descriptions.forEach((item, index) => {
        // ตรวจสอบว่ามี saved_text_group_id หรือไม่ก่อนเพิ่ม
        if (item.saved_text_group_id) {
          const key = `description_${index}`;
          newRowData1.push({
            id: index + 4,
            key,
            topic: `โจทย์ย่อยที่ ${index + 1}`,
            saved_text_group_id: item.saved_text_group_id,
            language_th: item?.language === 'th' ? item.text : '',
            language_en: item?.language === 'en' ? item.text : '',
            language_zh: item?.language === 'zh' ? item.text : '',
            text_to_ai_th: item?.language === 'th' ? item.text : '',
            text_to_ai_en: item?.language === 'en' ? item.text : '',
            text_to_ai_zh: item?.language === 'zh' ? item.text : '',
            speech_url_th: item.speech_url,
            speech_url_en: item.speech_url,
            speech_url_zh: item.speech_url,
          });
        }
      });
    }

    let newRowData2: RowData[] = [];

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
            speech_url_th: translations['th']?.speech_url || '',
            speech_url_en: translations['en']?.speech_url || '',
            speech_url_zh: translations['zh']?.speech_url || '',
            text_to_ai_th: translations['th']?.text_to_ai || '',
            text_to_ai_en: translations['en']?.text_to_ai || '',
            text_to_ai_zh: translations['zh']?.text_to_ai || '',
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
            speech_url_th: translations['th']?.speech_url || '',
            speech_url_en: translations['en']?.speech_url || '',
            speech_url_zh: translations['zh']?.speech_url || '',
            text_to_ai_th: translations['th']?.text_to_ai || '',
            text_to_ai_en: translations['en']?.text_to_ai || '',
            text_to_ai_zh: translations['zh']?.text_to_ai || '',
          });
        }
      });
    }

    if (beforeSave.length > 0) {
      newRowData1 = setNewTextTranslation(beforeSave, newRowData1);
      newRowData2 = setNewTextTranslation(beforeSave, newRowData2);
      setBeforeSave([]);
    }

    setRowData2(newRowData2);
    setRowData1(newRowData1);
  }, [selectedQuestion, mainLanguage]);

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
      <Modal
        open={showModalConfirmDelete}
        onClose={() => setShowModalConfirmDelete(false)}
        title="ต้องการลบเสียงนี้หรือไม่?"
        onOk={SubmitDelete}
        disableCancel
        disableOk
        className="w-[26rem]"
      >
        <div className="flex h-full flex-col gap-4">
          <div className="flex gap-4">
            เสียงที่ต้องการลบ:
            <IconSpeaker className="h-5 w-5" />
            <div>{selectedDelete?.text}</div>
          </div>
          <div className="font-bold">
            ({optionLanguage.find((item) => item.value === selectedDelete?.lang)?.label})
          </div>
          <div className="flex justify-end gap-4">
            <button
              className="btn btn-outline-primary w-full text-lg"
              onClick={() => setShowModalConfirmDelete(false)}
            >
              ยกเลิก
            </button>
            <CWButton
              variant="danger"
              className="w-full"
              title="ลบเสียง"
              onClick={SubmitDelete}
              loading={loading}
            />
          </div>
        </div>
      </Modal>
      <div className="mt-5 flex w-full flex-col gap-6 font-noto-sans-thai">
        <Box className="w-full rounded-lg bg-white p-5 shadow-md">
          <WizardBar tabs={tabs} activeId={4} />
        </Box>
        <Box className="flex flex-col gap-4">
          <Box className="flex flex-col items-center justify-center gap-2 bg-[#EAF1FF]">
            <div className="text-xl font-bold">ระบบช่วย Gen เสียงด้วย AI</div>
            <div>กรุณากดบันทึก เพื่อยืนยันการสร้างเสียง และบันทึกข้อมูล</div>
            <div className="flex gap-4">
              <CWButton
                className="btn btn-primary h-10 w-40"
                onClick={handleClickCreateSound}
                type="button"
                loading={loadingSound}
                title="สร้างเสียงด้วย AI"
              />
              <Link
                to={`/content-creator/level/${subLessonId}/create-public/${academicLevel.id}`}
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
          <div className="z-10 w-52">
            <Select
              label="เลือกภาษา"
              options={optionLanguage}
              value={selectedlanguage}
              onChange={(e) => setSelectedLanguage(e)}
              required
            />
          </div>
          <div className="datatables">
            <Table1
              title="โจทย์"
              rowData={rowData1}
              mainLanguage={mainLanguage}
              handleChange={handleChange}
              selectedRecords={selectedRecords}
              setSelectedRecords={setSelectedRecords}
              selectedlanguage={selectedlanguage}
              handleDelete={handleDelete}
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
              selectedlanguage={selectedlanguage}
              handleDelete={handleDelete}
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
  selectedlanguage,
  handleDelete,
}: {
  rowData: RowData[];
  mainLanguage: string;
  handleChange: (key: string, value: string) => void;
  selectedRecords: RowData[];
  setSelectedRecords: (value: RowData[]) => void;
  title?: string;
  selectedlanguage?: { value: string; label: string };
  handleDelete: (saved_text_group_id: string, lang: string, text: string) => void;
}) => {
  const languageFull = 'language_' + selectedlanguage?.value;

  const [languageOrders, setLanguageOrders] = useState<string[]>([
    'language_th',
    'language_en',
    'language_zh',
  ]);

  const [rowColumns, setRowColumns] = useState<DataTableColumn[]>([]);

  const getTitle = (language: string, column: string) => {
    const lang = language.split('_')[1];
    const langLabel =
      language === 'language_th'
        ? 'ภาษาไทย'
        : language === 'language_en'
          ? 'ภาษาอังกฤษ'
          : 'ภาษาจีน';

    if (column === '') {
      let titleLang = langLabel;
      if (lang === mainLanguage) {
        titleLang += ' (ค่าเเริ่มต้น)';
      }
      return titleLang;
    }

    if (column === 'text_to_ai') {
      return `แปลภาษาด้วย AI (${langLabel})`;
    }

    if (column === 'speech_url') {
      return `เสียง${langLabel}`;
    }
  };

  const getRenderCell = (language: string, column: string) => {
    const lang = language.split('_')[1];

    if (column === '') {
      return (record: Record<string, unknown>, index: number) => (
        <div className="text-wrap">{(record as RowData)[language] as string}</div>
      );
    }

    if (column === 'text_to_ai') {
      return (record: Record<string, unknown>, index: number) => (
        <textarea
          rows={1}
          className="form-textarea"
          placeholder="Language translation..."
          required
          value={(record as RowData)['text_to_ai_' + lang] as string}
          onInput={(e) => {
            handleChange(
              `${(record as RowData)['key']}_${['text_to_ai_' + lang]}`,
              e.currentTarget.value,
            );
          }}
          onChange={() => {}}
        />
      );
    }

    if (column === 'speech_url') {
      return (record: Record<string, unknown>, index: number) => (
        <ComponentSound
          isSound={(record as RowData)['speech_url_' + lang] ? true : false}
          soundUrl={(record as RowData)['speech_url_' + lang] as string}
          onClickDelete={() => {
            handleDelete(
              (record as RowData).saved_text_group_id,
              (record as RowData)['language_' + lang] as string,
              lang,
            );
          }}
        />
      );
    }
  };

  const getTextMainLanguage = (record: Record<string, unknown>) => {
    return (record as RowData)[`language_${mainLanguage}`] as string;
  };

  useEffect(() => {
    const newRowColumns: DataTableColumn[] = [
      {
        accessor: 'topic',
        width: 150,
        title: title,
      },
      {
        accessor: languageFull,
        width: 450,
        title: getTitle(languageFull, ''),
        render: getRenderCell(languageFull, ''),
      },
      {
        accessor: languageFull + '_text_to_ai',
        title: getTitle(languageFull, 'text_to_ai'),
        width: 450,
        render: getRenderCell(languageFull, 'text_to_ai'),
      },
      {
        accessor: languageFull + '_speech_url',
        title: getTitle(languageFull, 'speech_url'),
        width: 150,
        render: getRenderCell(languageFull, 'speech_url'),
      },
    ];

    setSelectedRecords([]);
    setRowColumns(newRowColumns);
  }, [languageFull]);

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
