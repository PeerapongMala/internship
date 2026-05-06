import CWButton from '@component/web/cw-button';
import CWWhiteBox from '@component/web/cw-white-box';
import ButtonPageSwitch from '../../molecule/cw-m-button-page-switch';
import { TPageStatus } from '@domain/g06/g06-d02/local/types';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { TEvaluationForm } from '@domain/g06/g06-d02/local/types/grade';
import { useMemo } from 'react';
import 'dayjs/locale/th';

type ManagerButtonActionPanelProps = {
  isSaving?: boolean;
  evaluationForm?: Partial<TEvaluationForm>;
  className?: string;
  pageStatus: TPageStatus;
  isNextButtonSubmit?: boolean;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onCancel?: () => void;
  noActionButton?: boolean;
};

const ManagerButtonActionPanel = ({
  isSaving,
  evaluationForm,
  className,
  pageStatus,
  isNextButtonSubmit,
  onNextPage,
  onPreviousPage,
  onCancel,
  noActionButton,
}: ManagerButtonActionPanelProps) => {
  const lastEdited = useMemo(() => {
    const date = evaluationForm?.updated_at ?? evaluationForm?.created_at;
    const by = evaluationForm?.updated_by ?? evaluationForm?.created_by;
    if (!date) return '-';

    const formattedDate = date.locale('th').format('D MMM BBBB HH:mm');

    return `${formattedDate} , ${by ?? '-'}`;
  }, [
    evaluationForm?.updated_at,
    evaluationForm?.updated_by,
    evaluationForm?.created_by,
    evaluationForm?.created_at,
  ]);

  return (
    <CWWhiteBox
      className={cn('flex flex-row justify-between bg-neutral-100 p-4', className)}
    >
      <div className="flex gap-6">
        {!noActionButton && (
          <>
            <CWButton title="บันทึก" type="submit" disabled={isSaving} />
            <CWButton title="ยกเลิก" type="button" outline onClick={onCancel} />

            <div className="flex flex-row items-center gap-4">
              <span> แก้ไขล่าสุด:</span>
              <span>{lastEdited} </span>
            </div>
          </>
        )}
      </div>

      <ButtonPageSwitch
        isNextButtonSubmit={isNextButtonSubmit}
        hideNextPage={pageStatus.isLastPage}
        hidePreviousPage={pageStatus.isFirstPage}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
      />
    </CWWhiteBox>
  );
};

export default ManagerButtonActionPanel;
