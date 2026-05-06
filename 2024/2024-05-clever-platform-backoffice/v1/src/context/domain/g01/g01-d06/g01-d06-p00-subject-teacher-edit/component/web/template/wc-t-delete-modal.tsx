import { Modal } from '@core/design-system/library/vristo/source/components/Modal';
import Button from '@domain/g01/g01-d06/local/component/web/atom/wc-a-button';
import { useTranslation } from 'react-i18next';
import ConfigJson from '@domain/g01/g01-d06/g01-d06-p00-subject-teacher-edit/config/index.json';

interface TableProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteModal(props: TableProps) {
  const { t } = useTranslation([ConfigJson.key]);

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      title={t('modal.header.deleteComfirm')}
      className="w-[25%]"
    >
      <div className="flex flex-col gap-2">
        <p>{t('modal.body.deleteDescription')}</p>
        <div className="flex gap-2 *:flex-1">
          <Button
            className="!border-dark-light !bg-transparent !text-black"
            onClick={props.onClose}
          >
            ยกเลิก
          </Button>
          <Button className="!border-danger !bg-danger" onClick={props.onDelete}>
            ลบบัญชี
          </Button>
        </div>
      </div>
    </Modal>
  );
}
