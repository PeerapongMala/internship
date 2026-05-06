import CWButton from '@component/web/cw-button';
import IconMoveStudent from '@core/design-system/library/component/icon/IconMoveStudent';
import API from '@domain/g01/g01-d05/local/api';
import { TMoveStudentCSVConflictRes } from '@domain/g01/g01-d05/local/api/type';
import { TBaseErrorResponse } from '@global/types/api';
import showMessage from '@global/utils/showMessage';
import { useParams } from '@tanstack/react-router';
import { AxiosError, isAxiosError } from 'axios';
import { useState } from 'react';
import MoveStudentModal from '../../molecule/cw-m-modal-move-student';
import useModalErrorInfos from '@global/hooks/useModalErrorInfos';
import showLoadingModal from '@global/utils/showLoadingModal';
import CWModalUploadSuccess from '@component/web/cw-modal/cw-modal-upload-success';
import useModal from '@global/utils/useModal';

const MoveStudentModalButton = () => {
  const { schoolId } = useParams({ strict: false });
  const [open, setOpen] = useState(false);

  const modalUploadSuccess = useModal();
  const modalErrorInfos = useModalErrorInfos({
    contextTitle: 'นักเรียน',
    messageTitle: 'ปัญหาที่พบภายในไฟล์',
  });

  const handleFileChange = async (file?: File, forceMove?: boolean) => {
    if (!file) {
      showMessage('กรุณาอัปโหลดไฟล์', 'warning');
      return;
    }

    setOpen(false);

    showLoadingModal();

    await API.classroom.MoveStudentCSV(
      schoolId,
      {
        csv_file: file,
        force_move: forceMove,
      },
      (error) => {
        if (!isAxiosError(error)) {
          showMessage('พบปัญหาในการอัปโหลดไฟล์', 'error');
        }

        let err = error as AxiosError<TBaseErrorResponse>;

        showMessage(err.message, 'error');

        if (err.response?.status === 409) {
          const conflictRes = err as AxiosError<TMoveStudentCSVConflictRes>;
          const conflictData = conflictRes.response?.data.data;

          if (conflictData)
            modalErrorInfos.setErrorInfos(
              conflictData.map((data) => ({
                context: data.name,
                message: data.message_list.join(', '),
              })),
            );
        }
      },
    );

    showMessage('ย้ายห้องเรียนสำเร็จ');
    modalUploadSuccess.open();
  };

  return (
    <>
      <CWButton
        title="Move Student"
        icon={<IconMoveStudent className="h-5 w-5" />}
        onClick={() => setOpen(true)}
      />

      <MoveStudentModal
        open={open}
        onClose={() => setOpen(false)}
        onFileChange={handleFileChange}
      />

      <CWModalUploadSuccess
        open={modalUploadSuccess.isOpen}
        onOk={() => modalUploadSuccess.close()}
        onClose={() => {
          modalUploadSuccess.close();
        }}
      />

      {modalErrorInfos.isOpen && modalErrorInfos.render()}
    </>
  );
};

export default MoveStudentModalButton;
