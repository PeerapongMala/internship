import API from '@domain/g06/g06-d02/local/api';
import {
  TPatchEvaluationFormIndicatorReq,
  TPatchEvaluationFormIndicatorRes,
} from '@domain/g06/g06-d02/local/api/helper/grade';
import ModalConfigIndicatorEvaluationCriteria, {
  ModalConfigIndicatorEvaluationCriteriaProps,
} from '@domain/g06/local/components/web/organism/cw-o-modal-config-indicator-evaluation-criteria';
import { TContentIndicator } from '@domain/g06/local/types/content';
import { TBaseErrorResponse } from '@global/types/api';
import showMessage from '@global/utils/showMessage';
import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import { ReactNode } from 'react';

type ModalConfigIndicatorProps = ModalConfigIndicatorEvaluationCriteriaProps & {};

const ModalTeacherConfigIndicator = ({
  onSave,
  indicator,
  ...props
}: ModalConfigIndicatorProps): ReactNode => {
  const handleSave = async (data: TContentIndicator) => {
    if (!indicator?.id) return;

    const payload: TPatchEvaluationFormIndicatorReq = {
      ...data,
      setting: data.setting ?? [],
    };

    let response: AxiosResponse<TPatchEvaluationFormIndicatorRes>;
    try {
      response = await API.Grade.PatchIndicatorByID(indicator.id, payload);
    } catch (error) {
      if (!isAxiosError(error)) {
        showMessage('พบปัญหาในการบันทึกตัวชี้วัด', 'error');
        throw error;
      }

      const err = error as AxiosError<TBaseErrorResponse>;
      const errorMessage = err.response?.data?.message || err.message;
      showMessage(errorMessage, 'error');
      throw error;
    }

    if (response.data.data.length > 0) onSave?.(response.data.data[0]);

    props.onClose();
  };

  return (
    <ModalConfigIndicatorEvaluationCriteria
      onSave={handleSave}
      indicator={indicator}
      {...props}
    />
  );
};

export default ModalTeacherConfigIndicator;
