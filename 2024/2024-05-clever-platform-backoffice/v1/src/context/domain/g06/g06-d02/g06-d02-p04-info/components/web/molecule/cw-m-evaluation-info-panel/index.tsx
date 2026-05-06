import CWButton from '@component/web/cw-button';
import { EEvaluationFormStatus } from '@domain/g06/g06-d02/local/enums/evaluation';
import { getStatusBadgeLabel } from '@domain/g06/g06-d02/local/helpers/status';
import {
  TEvaluationForm,
  TGradeResponsiblePerson,
} from '@domain/g06/g06-d02/local/types/grade';
import API from '@domain/g06/g06-d02/local/api';
import 'dayjs/locale/th';
import { AxiosError, isAxiosError } from 'axios';
import showMessage from '@global/utils/showMessage';
import { TBaseErrorResponse } from '@global/types/api';
import { useState } from 'react';

type EvaluationInfoPanelProps = {
  evaluation?: TEvaluationForm;
  evaluationID: number;
  responsibleLists: TGradeResponsiblePerson[];
  disableSave?: boolean;
  onSaveSuccess?: () => void;
};

const EvaluationInfoPanel = ({
  evaluation,
  evaluationID,
  responsibleLists,
  disableSave,
  onSaveSuccess,
}: EvaluationInfoPanelProps) => {
  const [fetching, setFetching] = useState(false);

  const handleSave = async () => {
    setFetching(true);
    try {
      await API.Grade.PutGradeResponsiblePerson(evaluationID, responsibleLists);
    } catch (error) {
      if (isAxiosError(error)) {
        const err = error as AxiosError<TBaseErrorResponse>;
        showMessage(err.response?.data.message, 'error');
        return;
      }

      showMessage('พบปัญหาขณะปันทึกข้อมูล', 'error');
      throw error;
    } finally {
      setFetching(false);
    }
    onSaveSuccess?.();
    showMessage('บันทึกข้อมูลสำเร็จ');
  };

  return (
    <div className="flex h-fit w-full max-w-[380px] flex-col gap-4 rounded-md bg-white p-4 text-sm drop-shadow">
      <div className="flex items-center py-1">
        <span className="w-full max-w-[150px]">รหัสใบประเมินวิชา:</span>
        <span className="flex-1 text-[#0e1725]">
          {evaluation?.id?.toString?.()?.padStart?.(5, '0')}
        </span>
      </div>
      <div className="flex items-center py-1">
        <span className="w-full max-w-[150px]">สถานะ:</span>
        <span className="flex-1 text-[#0e1725]">
          {getStatusBadgeLabel(evaluation?.status ?? EEvaluationFormStatus.DISABLED)}
        </span>
      </div>
      <div className="flex items-center py-1">
        <span className="w-full max-w-[150px]">แก้ไขล่าสุด:</span>
        <span className="flex-1 text-[#0e1725]">
          {evaluation?.updated_at
            ? evaluation?.updated_at?.locale('th').format('DD MMM BBBB H:MM')
            : '-'}
        </span>
      </div>
      <div className="flex items-center py-1">
        <span className="w-full max-w-[150px]">แก้ไขล่าสุดโดย:</span>
        <span className="flex-1 text-[#0e1725]">{evaluation?.updated_by ?? '-'}</span>
      </div>

      <CWButton disabled={disableSave || fetching} title="บันทึก" onClick={handleSave} />
    </div>
  );
};

export default EvaluationInfoPanel;
