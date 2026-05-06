import { Input } from '@core/design-system/library/vristo/source/components/Input';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import { useEffect, useState } from 'react';
import { TranslateObject } from '@domain/g02/g02-d05/local/type';
import CWButton from '@component/web/cw-button';
import ComponentSound from '../../molecule/ComponentSound';

interface ModalNewCreateProps extends ModalProps {
  curriculumGroupId?: string | number;
  onCreate?: (thaiText: string, engText: string, chiText: string) => void;
  onClose: () => void;
  open: boolean;
  translateData?: TranslateObject;
  onClickDelete?: (language: string) => void;
  thaiText?: string;
  engText?: string;
  chiText?: string;
  thaiTextToAI?: string;
  engTextToAI?: string;
  chiTextToAI?: string;
  onSave?: () => void;
  onChange?: (language: string, text: string) => void;
  loadings?: {
    translate: boolean;
    saveText: boolean;
    createSound: boolean;
    deleteSound: boolean;
  };
}

const ModalNewCreateSound = ({
  open,
  onClose,
  onCreate,
  curriculumGroupId,
  translateData,
  onClickDelete,
  thaiText,
  engText,
  chiText,
  thaiTextToAI: initThaiTextToAI,
  engTextToAI: initEngTextToAI,
  chiTextToAI: initChiTextToAI,
  onSave,
  onChange,
  loadings,
  ...rest
}: ModalNewCreateProps) => {
  const [checkLanguages, setCheckLanguages] = useState<{
    [key: string]: boolean;
  }>({ th: false, en: false, zh: false });
  const [thaiTextToAI, setThaiTextToAI] = useState<string>(
    initThaiTextToAI || thaiText || '',
  );
  const [engTextToAI, setEngTextToAI] = useState<string>(
    initEngTextToAI || engText || '',
  );
  const [chiTextToAI, setChiTextToAI] = useState<string>(
    initChiTextToAI || chiText || '',
  );

  useEffect(() => {
    setThaiTextToAI(initThaiTextToAI || thaiText || '');
    setEngTextToAI(initEngTextToAI || engText || '');
    setChiTextToAI(initChiTextToAI || chiText || '');

    const newCheckLanguages = { ...checkLanguages };
    if (thaiText) {
      newCheckLanguages['th'] = true;
    }
    if (engText) {
      newCheckLanguages['en'] = true;
    }
    if (chiText) {
      newCheckLanguages['zh'] = true;
    }
    setCheckLanguages(newCheckLanguages);
  }, [thaiText, initThaiTextToAI, engText, initEngTextToAI, chiText, initChiTextToAI]);

  const handleCreateSound = () => {
    onCreate && onCreate(thaiTextToAI, engTextToAI, chiTextToAI);
  };

  console.log(translateData?.translations);

  return (
    <Modal
      className="h-[30rem] w-3/4"
      open={open}
      onClose={onClose}
      disableCancel
      disableOk
      title="การสร้างเสียงข้อความ"
      {...rest}
    >
      <div className="flex flex-col gap-2">
        <div className="mb-4 flex w-full items-center gap-2">
          <div className="w-1/4">รหัสข้อความ:</div>
          <div className="w-full">
            {translateData?.group_id || translateData?.saved_text_group_id || '-'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex w-full items-center gap-2">
            <input
              type="checkbox"
              className="form-checkbox"
              onChange={(e) =>
                setCheckLanguages({ ...checkLanguages, th: e.target.checked })
              }
              defaultChecked={checkLanguages['th']}
            />
            <Input
              required
              label="ข้อความภาษาไทย"
              className="w-full"
              placeholder="คำตอบ"
              // onInput={(e) => setThaiTextToAI(e.target.value)}
              onInput={(e) => onChange?.('thaiTextToAI', e.target.value)}
              value={thaiTextToAI}
              disabled={!checkLanguages['th']}
            />
          </label>
          <ComponentSound
            soundUrl={translateData?.translations?.th?.speech_url}
            isSound={translateData?.translations?.th?.speech_url ? true : false}
            onClickDelete={() => {
              onClickDelete && onClickDelete('th');
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex w-full items-center gap-2">
            <input
              type="checkbox"
              className="form-checkbox"
              onChange={(e) =>
                setCheckLanguages({ ...checkLanguages, en: e.target.checked })
              }
              defaultChecked={checkLanguages['en']}
            />
            <Input
              required
              label="ข้อความภาษาอังกฤษ"
              className="w-full"
              placeholder="คำตอบ"
              value={engTextToAI}
              // onInput={(e) => setEngTextToAI(e.target.value)}
              onInput={(e) => onChange?.('engTextToAI', e.target.value)}
              disabled={!checkLanguages['en']}
            />
          </label>
          <ComponentSound
            soundUrl={translateData?.translations?.en?.speech_url}
            isSound={translateData?.translations?.en?.speech_url ? true : false}
            onClickDelete={() => {
              onClickDelete && onClickDelete('en');
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex w-full items-center gap-2">
            <input
              type="checkbox"
              className="form-checkbox"
              onChange={(e) =>
                setCheckLanguages({ ...checkLanguages, zh: e.target.checked })
              }
              defaultChecked={checkLanguages['zh']}
            />
            <Input
              required
              label="ข้อความภาษาจีน"
              className="w-full"
              placeholder="คำตอบ"
              value={chiTextToAI}
              // onInput={(e) => setChiTextToAI(e.target.value)}
              onInput={(e) => onChange?.('chiTextToAI', e.target.value)}
              disabled={!checkLanguages['zh']}
            />
          </label>
          <ComponentSound
            soundUrl={translateData?.translations?.zh?.speech_url}
            isSound={translateData?.translations?.zh?.speech_url ? true : false}
            onClickDelete={() => {
              onClickDelete && onClickDelete('zh');
            }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button className="btn btn-outline-primary w-44" onClick={onClose}>
            ย้อนกลับ
          </button>
          <div className="flex gap-2">
            <CWButton
              className="w-44"
              title="บันทึก"
              onClick={onSave}
              loading={loadings?.createSound}
            />
            <CWButton
              className="w-44"
              title="สร้างเสียง AI"
              onClick={handleCreateSound}
              loading={loadings?.createSound}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalNewCreateSound;
