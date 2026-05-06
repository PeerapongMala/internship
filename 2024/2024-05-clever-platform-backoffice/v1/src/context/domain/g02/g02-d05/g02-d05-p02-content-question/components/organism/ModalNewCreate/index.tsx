import IconVolumeLoud from '@core/design-system/library/vristo/source/components/Icon/IconVolumeLoud';
import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import IconCaretsDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretsDown';
import IconPlus from '@core/design-system/library/vristo/source/components/Icon/IconPlus';
import {
  Input,
  Select,
} from '@core/design-system/library/vristo/source/components/Input';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import { useEffect, useState } from 'react';
import API from '@domain/g02/g02-d05/local/api';
import { TranslateObject } from '@domain/g02/g02-d05/local/type';
import ModalNewCreateSound from '../ModalNewCreateSound';
import IconSpeaker from '@core/design-system/library/component/icon/IconSpeaker';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import CWButton from '@component/web/cw-button';
import showMessage from '@global/utils/showMessage';

const optionLanguages = [
  { value: 'th', label: 'ภาษาไทย' },
  { value: 'en', label: 'ภาษาอังกฤษ' },
  { value: 'zh', label: 'ภาษาจีน' },
];

interface ModalNewCreateProps extends ModalProps {
  curriculumGroupId?: string | number;
  onOk?: () => void;
  onClose: () => void;
  open: boolean;
  initTranslateData?: TranslateObject | undefined;
  mainLanguage?: string;
}

const ModalNewCreate = ({
  open,
  onClose,
  onOk,
  curriculumGroupId,
  initTranslateData,
  mainLanguage,
  ...rest
}: ModalNewCreateProps) => {
  const [translateData, setTranslateData] = useState<TranslateObject>();

  const [showModalNewCreateSound, setShowModalNewCreateSound] = useState(false);
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
  const [loadings, setLoadings] = useState<{
    translate: boolean;
    saveText: boolean;
    createSound: boolean;
    deleteSound: boolean;
  }>({
    translate: false,
    saveText: false,
    createSound: false,
    deleteSound: false,
  });

  const [checkLanguages, setCheckLanguages] = useState<{
    [key: string]: boolean;
  }>({ th: false, en: false, zh: false });
  const [srcLanguage, setSrcLanguage] = useState<string>('th');
  const [thaiText, setThaiText] = useState<string>('');
  const [engText, setEngText] = useState<string>('');
  const [chiText, setChiText] = useState<string>('');
  const [thaiTextToAI, setThaiTextToAI] = useState<string>('');
  const [engTextToAI, setEngTextToAI] = useState<string>('');
  const [chiTextToAI, setChiTextToAI] = useState<string>('');

  const [selectedDelete, setSelectedDelete] = useState<string>('');

  const handlePostGetTranslateData = () => {
    setLoadings({ ...loadings, translate: true });
    const srcText =
      srcLanguage === 'th'
        ? thaiText
        : srcLanguage === 'en'
          ? engText
          : srcLanguage === 'zh'
            ? chiText
            : '';
    const destLanguages = Object.keys(checkLanguages).filter(
      (lang) => checkLanguages[lang],
    );

    const data = {
      src_language: srcLanguage,
      src_text: srcText,
      dest_languages: destLanguages,
    };

    API.academicLevel.CreateG02D05A47(data).then((res) => {
      setLoadings({ ...loadings, translate: false });
      if (res.status_code === 200) {
        if (res.data?.[0]?.th) setThaiText(res.data?.[0]?.th);
        if (res.data?.[0]?.en) setEngText(res.data?.[0]?.en);
        if (res.data?.[0]?.zh) setChiText(res.data?.[0]?.zh);
        showMessage('แปลข้อความสำเร็จ', 'success');
        return true;
      } else {
        showMessage(res.message, 'error');
        return false;
      }
    });
  };

  const handleSaveTranslate = () => {
    setLoadings({ ...loadings, saveText: true });
    const formData = new FormData();
    if (checkLanguages['th'] || srcLanguage === 'th') {
      formData.append('thai_text', thaiText);
    }

    if (checkLanguages['en'] || srcLanguage === 'en') {
      formData.append('english_text', engText);
    }

    if (checkLanguages['zh'] || srcLanguage === 'zh') {
      formData.append('chinese_text', chiText);
    }

    if (
      curriculumGroupId &&
      !translateData?.group_id &&
      !translateData?.saved_text_group_id
    ) {
      API.academicLevel
        .CreateG02D05A38(curriculumGroupId?.toString(), formData)
        .then((res) => {
          setLoadings({ ...loadings, saveText: false });
          if (res.status_code === 201) {
            const translateObject: TranslateObject = {
              group_id: res.data?.[0].group_id,
              translations: res.data?.[0].translations,
            };

            setTranslateData(translateObject);
            showMessage('สร้างข้อความเสียงสำเร็จ', 'success');
            return true;
          } else {
            showMessage(res.message, 'error');
            return false;
          }
        });
    } else if (translateData?.group_id || translateData?.saved_text_group_id) {
      const form = {
        thai_text: thaiText,
        english_text: engText,
        chinese_text: chiText,
        // admin_login_as: 'admin'
      };
      const groupId = translateData?.group_id || translateData?.saved_text_group_id;
      if (groupId) {
        API.academicLevel.UpdateG02D05A48(groupId, form).then((res) => {
          setLoadings({ ...loadings, saveText: false });
          if (res.status_code === 200) {
            const translateObject: TranslateObject = {
              group_id: res.data?.[0]?.group_id,
              saved_text_group_id: res.data?.[0]?.saved_text_group_id,
              translations: res.data?.[0].translations,
            };

            setTranslateData(translateObject);
            showMessage('บันทึกข้อความเสียงสำเร็จ', 'success');
            return true;
          } else {
            showMessage(res.message, 'error');
            return false;
          }
        });
      }
    }
  };

  const handleSaveTextToAI = () => {
    const groupId = translateData?.group_id || translateData?.saved_text_group_id;
    if (groupId) {
      const data = {
        thai_text_to_ai: thaiTextToAI,
        english_text_to_ai: engTextToAI,
        chinese_text_to_ai: chiTextToAI,
        // admin_login_as: 'admin'
      };
      API.academicLevel.UpdateG02D05A48(groupId, data).then((res) => {
        setLoadings({ ...loadings, saveText: false });
        if (res.status_code === 200) {
          const translateObject: TranslateObject = {
            group_id: res.data?.[0]?.group_id,
            saved_text_group_id: res.data?.[0]?.saved_text_group_id,
            translations: res.data?.[0].translations,
          };

          setTranslateData(translateObject);
          showMessage('บันทึกข้อความเสียงสำเร็จ', 'success');
          return true;
        } else {
          showMessage(res.message, 'error');
          return false;
        }
      });
    }
  };

  const handleCreateSound = (
    thaiTextToAI: string,
    engTextToAI: string,
    chiTextToAI: string,
  ) => {
    setLoadings({ ...loadings, createSound: true });
    const form = {
      thai_text_to_ai: thaiTextToAI,
      english_text_to_ai: engTextToAI,
      chinese_text_to_ai: chiTextToAI,
      // admin_login_as: 'admin'
    };

    const groupId = translateData?.group_id || translateData?.saved_text_group_id;
    if (groupId) {
      API.academicLevel.UpdateG02D05A42(groupId, form).then((res) => {
        setLoadings({ ...loadings, createSound: false });
        if (res.status_code === 200) {
          const translateObject: TranslateObject = {
            group_id: res.data?.[0]?.group_id,
            saved_text_group_id: res.data?.[0]?.saved_text_group_id,
            translations: res.data?.[0].translations,
          };
          setTranslateData(translateObject);
          showMessage('สร้างข้อความเสียงสำเร็จ', 'success');
          return true;
        } else {
          showMessage(res.message, 'error');
          return false;
        }
      });
    }
  };

  const handleChange = (key: string, value: string) => {
    if (key === 'thaiTextToAI') {
      setThaiTextToAI(value);
    }
    if (key === 'engTextToAI') {
      setEngTextToAI(value);
    }
    if (key === 'chiTextToAI') {
      setChiTextToAI(value);
    }
  };

  const handleDelete = (language: string) => {
    setSelectedDelete(language);
    setShowModalConfirmDelete(true);
  };

  const submitDelete = () => {
    if (selectedDelete) {
      setLoadings({ ...loadings, deleteSound: true });
      const data = {
        // group_id: translateData?.group_id,
        language: selectedDelete,
        // admin_login_as: 'admin'
      };

      const groupId = translateData?.group_id || translateData?.saved_text_group_id;
      if (groupId) {
        API.academicLevel.DeleteG02D05A45(groupId, data).then((res) => {
          setLoadings({ ...loadings, deleteSound: false });
          if (res.status_code === 200) {
            const translateObject: TranslateObject = {
              group_id: res.data?.[0]?.group_id,
              saved_text_group_id: res.data?.[0]?.saved_text_group_id,
              translations: res.data?.[0].translations,
            };
            setTranslateData(translateObject);
            showMessage('ลบข้อความเสียงสำเร็จ', 'success');
            setShowModalConfirmDelete(false);
            return true;
          } else {
            setShowModalConfirmDelete(false);
            showMessage(res.message, 'error');
            return false;
          }
        });
      }
    }
  };

  useEffect(() => {
    if (translateData && mainLanguage) {
      const checkLanguages = {
        th: !!translateData?.translations['th']?.text || false,
        en: !!translateData?.translations['en']?.text || false,
        zh: !!translateData?.translations['zh']?.text || false,
      };

      setCheckLanguages({ ...checkLanguages, [mainLanguage]: false });

      setThaiText(translateData?.translations['th']?.text || '');
      setEngText(translateData?.translations['en']?.text || '');
      setChiText(translateData?.translations['zh']?.text || '');
      setThaiTextToAI(translateData?.translations['th']?.text_to_ai || '');
      setEngTextToAI(translateData?.translations['en']?.text_to_ai || '');
      setChiTextToAI(translateData?.translations['zh']?.text_to_ai || '');

      setSrcLanguage(mainLanguage);
    }
  }, [translateData, mainLanguage]);

  useEffect(() => {
    if (mainLanguage) {
      setSrcLanguage(mainLanguage);
    }
  }, [mainLanguage]);

  useEffect(() => {
    if (initTranslateData) {
      setTranslateData(initTranslateData);
    } else {
      setTranslateData(undefined);
      setCheckLanguages({ th: false, en: false, zh: false });
      setThaiText('');
      setEngText('');
      setChiText('');
      setThaiTextToAI('');
      setEngTextToAI('');
      setChiTextToAI('');
      if (mainLanguage) {
        setSrcLanguage(mainLanguage);
      }
    }
  }, [initTranslateData, open]);

  return (
    <Modal
      className="h-[35rem] w-3/4"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="การแปลข้อความ"
      {...rest}
    >
      <Modal
        open={showModalConfirmDelete}
        onClose={() => setShowModalConfirmDelete(false)}
        title="ต้องการลบเสียงนี้หรือไม่?"
        onOk={onOk}
        disableCancel
        disableOk
        className="w-[26rem]"
      >
        <div className="flex h-full flex-col gap-4">
          <div className="flex gap-4">
            เสียงที่ต้องการลบ:
            <IconSpeaker className="h-5 w-5" />
            {translateData?.translations[selectedDelete]?.text}
          </div>
          <div className="font-bold">
            ({optionLanguages.find((item) => item.value === selectedDelete)?.label})
          </div>
          <div className="flex justify-end gap-4">
            <button
              className="btn btn-outline-primary w-full text-lg"
              onClick={() => setShowModalConfirmDelete(false)}
            >
              ยกเลิก
            </button>
            <button className="btn btn-danger w-full text-lg" onClick={submitDelete}>
              ลบเสียง
            </button>
          </div>
        </div>
      </Modal>
      <ModalNewCreateSound
        open={showModalNewCreateSound}
        onClose={() => setShowModalNewCreateSound(false)}
        onSave={handleSaveTextToAI}
        translateData={translateData}
        curriculumGroupId={curriculumGroupId}
        onCreate={handleCreateSound}
        onClickDelete={handleDelete}
        thaiText={thaiText}
        engText={engText}
        chiText={chiText}
        thaiTextToAI={thaiTextToAI}
        engTextToAI={engTextToAI}
        chiTextToAI={chiTextToAI}
        onChange={handleChange}
        loadings={loadings}
      />
      <div className="flex flex-col gap-2">
        <div className="mb-4 flex w-full items-center gap-2">
          <div className="w-1/4">รหัสข้อความ:</div>
          <div className="w-full">
            {translateData?.group_id || translateData?.saved_text_group_id || '-'}
          </div>
        </div>
        <div className="mb-4 flex w-full items-center gap-2">
          <div className="w-1/4">แปลข้อความด้วย AI จาก:</div>
          <div className="w-full">
            <Select
              className="w-1/4"
              options={optionLanguages}
              onChange={(value) => {
                setSrcLanguage(value.value);
                if (checkLanguages[value.value]) {
                  setCheckLanguages({
                    ...checkLanguages,
                    [value.value]: false,
                  });
                }
              }}
              value={optionLanguages.find((item) => item.value === srcLanguage)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex w-full items-center gap-2">
            <input
              type="checkbox"
              className={cn('form-checkbox', {
                // "hover:!bg-primary/50 !bg-primary/50": srcLanguage === "th",
              })}
              onChange={(e) =>
                setCheckLanguages({ ...checkLanguages, th: e.target.checked })
              }
              checked={checkLanguages['th']}
              disabled={srcLanguage === 'th'}
            />
            <Input
              required
              label="ข้อความภาษาไทย"
              className="w-full"
              placeholder="คำตอบ"
              onInput={(e) => setThaiText(e.target.value)}
              disabled={!(srcLanguage === 'th' || checkLanguages['th'])}
              value={thaiText}
            />
          </label>
          {/* <ComponentSound isSound={true} /> */}
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex w-full items-center gap-2">
            <input
              type="checkbox"
              className={cn('form-checkbox', {
                // "hover:!bg-primary/50 !bg-primary/50": srcLanguage === "en",
              })}
              onChange={(e) =>
                setCheckLanguages({ ...checkLanguages, en: e.target.checked })
              }
              checked={checkLanguages['en']}
              disabled={srcLanguage === 'en'}
            />
            <Input
              required
              label="ข้อความภาษาอังกฤษ"
              className="w-full"
              placeholder="คำตอบ"
              onInput={(e) => setEngText(e.target.value)}
              disabled={!(srcLanguage === 'en' || checkLanguages['en'])}
              value={engText}
            />
          </label>
          {/* <ComponentSound isSound={false} /> */}
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex w-full items-center gap-2">
            <input
              type="checkbox"
              className={cn('form-checkbox', {
                // "hover:!bg-primary/50 !bg-primary/50": srcLanguage === "zh",
              })}
              onChange={(e) =>
                setCheckLanguages({ ...checkLanguages, zh: e.target.checked })
              }
              checked={checkLanguages['zh']}
              disabled={srcLanguage === 'zh'}
            />
            <Input
              required
              label="ข้อความภาษาจีน"
              className="w-full"
              placeholder="คำตอบ"
              onInput={(e) => setChiText(e.target.value)}
              disabled={!(srcLanguage === 'zh' || checkLanguages['zh'])}
              value={chiText}
            />
          </label>
          {/* <ComponentSound isSound={false} /> */}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <CWButton
            className="w-44"
            title="แปลข้อความ"
            onClick={handlePostGetTranslateData}
            loading={loadings.translate}
          />
          <div className="flex gap-2">
            <CWButton
              className="w-44"
              title="บันทึก"
              onClick={handleSaveTranslate}
              loading={loadings.saveText}
            />
            <CWButton
              className="w-44"
              title="ต่อไป"
              onClick={() => setShowModalNewCreateSound(true)}
              disabled={!translateData?.group_id && !translateData?.saved_text_group_id}
              suffix={<IconCaretDown className="-rotate-90" />}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalNewCreate;
