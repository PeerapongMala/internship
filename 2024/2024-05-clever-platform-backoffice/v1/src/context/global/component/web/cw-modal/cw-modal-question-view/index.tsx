import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import CWTLevelView from '@component/web/template/cw-t-question-view';

interface CWModalQuestionView extends ModalProps {
  open: boolean;
  onClose: () => void;
  levelId?: number;
  levelPlayLogId?: number;
  useSchoolStatAPI?: boolean;
}

const CWModalQuestionView = ({
  open,
  onClose,
  children,
  onOk,
  levelId,
  levelPlayLogId,
  useSchoolStatAPI = false,
  ...rest
}: CWModalQuestionView) => {
  return (
    <Modal
      className="w-[400px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="คำถาม"
      {...rest}
    >
      {/* Temporary  fix for prevent re-render on open state change to false */}
      {open && (
        <CWTLevelView
          levelId={levelId}
          levelPlayLogId={levelPlayLogId}
          useSchoolStatAPI={useSchoolStatAPI}
        />
      )}
      <div className="mt-5 flex w-full justify-center">
        <button className="btn btn-outline-primary flex w-32 gap-2" onClick={onClose}>
          ย้อนกลับ
        </button>
      </div>
    </Modal>
  );
};

export default CWModalQuestionView;
