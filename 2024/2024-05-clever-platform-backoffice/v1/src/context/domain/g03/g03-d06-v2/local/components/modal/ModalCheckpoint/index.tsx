import { useState, useEffect } from 'react';
import {
  Modal,
  ModalProps,
} from '../../../../../../../../core/design-system/library/vristo/source/components/Modal';
import ModalQuestion from '../ModalQuestion';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import CWModalQuestionView from '@component/web/cw-modal/cw-modal-question-view';
import { DetailLevel } from '@domain/g03/g03-d06/local/type';

interface ModalCheckpointProps extends ModalProps {
  open?: boolean;
  onClose: () => void;
  subjectId?: string;
  detailLevels?: DetailLevel[];
}

const ModalCheckpoint = ({
  open,
  onClose,
  onOk,
  subjectId,
  detailLevels,
  ...rest
}: ModalCheckpointProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<DetailLevel | null>(null);

  const handleShowModal = (level: DetailLevel) => {
    setSelectedLevel(level);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLevel(null);
  };

  return (
    <Modal
      className="w-[400px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="ด่าน"
      {...rest}
    >
      {detailLevels?.map((checkpoint) => (
        <div
          key={checkpoint?.level_id}
          className="mb-4 flex w-full items-center justify-between gap-2 bg-neutral-100 px-2 py-1.5"
        >
          <p className="font-bold">ด่าน {checkpoint?.level_index ?? 0}</p>
          <p>{checkpoint?.total_question ?? 0} คำถาม</p>
          <p>
            {checkpoint?.correct_answer_count ?? 0}/{checkpoint?.total_question ?? 0}
          </p>
          <button
            onClick={() => handleShowModal(checkpoint)}
            className="hover:text-primary"
          >
            <IconEye />
          </button>
        </div>
      ))}
      <CWModalQuestionView
        open={showModal}
        onClose={handleCloseModal}
        levelId={selectedLevel?.level_id || 0}
        levelPlayLogId={selectedLevel?.level_play_log_id || 0}
      />

      <div className="flex justify-center">
        <button className="btn btn-outline-primary flex w-32 gap-2" onClick={onClose}>
          ย้อนกลับ
        </button>
      </div>
    </Modal>
  );
};

export default ModalCheckpoint;
