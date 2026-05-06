import ManagerSubjectInfoPanel from '../../organism/cw-o-manager-subject-info';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import {
  TEvaluationFormCreate,
  TEvaluationFormEdit,
} from '@domain/g06/g06-d02/local/types/grade';
import { TEvaluationFormOnChange } from '@domain/g06/g06-d02/local/types/props';

type TemplateManagerFirstPageProps = {
  evaluationForm: TEvaluationFormCreate | TEvaluationFormEdit;
  hidden?: boolean;
  isSubmitStep?: boolean;
  onDataChange?: TEvaluationFormOnChange;
  disabledEdit?: boolean;
};

const TemplateManagerFirstPage = ({
  evaluationForm,
  onDataChange,
  hidden,
  isSubmitStep,
  disabledEdit,
}: TemplateManagerFirstPageProps) => {
  return (
    <div className={cn('flex flex-col gap-5', hidden ? 'hidden' : '')}>
      <ManagerSubjectInfoPanel
        evaluationForm={evaluationForm}
        isSubmitStep={isSubmitStep}
        onChange={onDataChange}
        disabledEdit={disabledEdit}
      />
    </div>
  );
};

export default TemplateManagerFirstPage;
