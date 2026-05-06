import CWButton from '@component/web/cw-button';
import CWInput from '@component/web/cw-input';
import IconSettings from '@core/design-system/library/component/icon/IconSettings';
import IconTrash from '@core/design-system/library/component/icon/IconTrash';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import useModal from '@global/utils/useModal';
import ModalConfigIndicatorEvaluationCriteria from '../../organism/cw-o-modal-config-indicator-evaluation-criteria';
import { TContentIndicator } from '@domain/g06/local/types/content';

type ItemIndicatorProps = {
  deleteAble?: boolean;
  isAcademicContext?: boolean;
  onClickEdit?: () => void;
  onDelete?: () => void;
  label?: string;
  required?: boolean;
  subjectID?: number;
  indicator: TContentIndicator;
  onChange?: (indicator: TContentIndicator) => void;
  disabledEdit?: boolean;
};

const ItemIndicator = ({
  disabledEdit,
  isAcademicContext,
  label,
  indicator,
  required,
  deleteAble,
  onDelete,
  onClickEdit,
  subjectID,
  onChange,
}: ItemIndicatorProps) => {
  // Modal Setting Indicator
  const { isOpen, open, close } = useModal();

  return (
    <div className="flex items-end gap-6">
      {/* indicator name */}
      <CWInput
        disabled
        className="w-full"
        required={required}
        label={label}
        value={indicator.name}
      />

      {/* weight */}
      <CWInput
        disabled={disabledEdit}
        className="w-full hide-arrow"
        type="number"
        required={required}
        label="คะแนนเต็ม"
        value={indicator.max_value}
        onChange={(e) => onChange?.({ ...indicator, max_value: Number(e.target.value) })}
      />

      <div className="flex gap-5">
        <button
          className={cn('p-1.5', deleteAble && !disabledEdit ? '' : 'invisible')}
          type="button"
          onClick={onDelete}
        >
          <IconTrash />
        </button>

        <CWButton
          className="whitespace-nowrap"
          outline
          onClick={() => {
            onClickEdit?.();
            open();
          }}
          type="button"
          icon={<IconSettings />}
          title="เกณฑ์การประเมิน"
        />
      </div>

      {/*  ตั้งค่าเกณฑ์การประเมิน */}
      {isOpen && (
        <ModalConfigIndicatorEvaluationCriteria
          isAcademicContext={isAcademicContext}
          disabledEdit={disabledEdit}
          subjectID={subjectID}
          evaluationFormSubjectID={indicator.evaluation_form_subject_id}
          indicator={indicator}
          isOpen={isOpen}
          onClose={() => {
            close();
          }}
          onSave={(indicator) => {
            onChange?.(indicator);
            close();
          }}
        />
      )}
    </div>
  );
};

export default ItemIndicator;
