import { Modal } from '@core/design-system/library/vristo/source/components/Modal';
import Button from '@domain/g01/g01-d06/local/component/web/atom/wc-a-button';
import { useTranslation } from 'react-i18next';
import ConfigJson from '@domain/g01/g01-d06/g01-d06-p00-subject-teacher-edit/config/index.json';
import TextInputLabel from '@domain/g01/g01-d06/local/component/web/molecule/wc-m-text-input-label';
import SelectLabel from '@domain/g01/g01-d06/local/component/web/molecule/wc-m-select-label';

interface TableProps {
  open: boolean;
  onClose: () => void;
}

const subjects = [{ label: 'ภาษาอังกฤษ', value: 'ภาษาอังกฤษ' }];
const classYears = [{ label: 'ป. 1', value: 'ภาษาอังกฤษ' }];

export default function ChangeSubjectModal(props: TableProps) {
  const { t } = useTranslation([ConfigJson.key]);

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      title={t('modal.header.changeSubject')}
      className="w-[30%]"
    >
      <div className="flex flex-col gap-2 divide-y-2">
        <div className="flex flex-col gap-4">
          <TextInputLabel label={'รหัสบัญชี:'} name={'accountIdTextInput'} required />
          <TextInputLabel label={'ปีการศึกษา:'} name={'yearTextInput'} required />
          <SelectLabel
            label={'ชื่อวิชา:'}
            name={'subjectNameInput'}
            required
            options={subjects}
          />
          <SelectLabel
            label={'ชั้นปี:'}
            name={'subjectNameInput'}
            required
            options={classYears}
          />
          <div className="mt-3 flex gap-2 *:flex-1">
            <Button
              className="!border-dark-light !bg-transparent !text-black"
              onClick={props.onClose}
            >
              กลับ
            </Button>
            <Button onClick={props.onClose}>ย้ายวิชา</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
