import CWButton from '@component/web/cw-button';
import { TErrorInfos } from '@component/web/cw-modal/cw-modal-error-infos/type';
import CWWhiteBox from '@component/web/cw-white-box';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { ISubject } from '@domain/g02/g02-d02/local/type';
import { mapToGradeIndicators } from '@domain/g02/g02-d09/local/utils/map-grade';
import ButtonPageSwitch from '@domain/g06/g06-d02/local/component/web/molecule/cw-m-button-page-switch';
import API from '@domain/g06/local/api';
import { TSubjectTemplate } from '@domain/g06/local/types/subject-template';
import { validateSubjectIndicator } from '@domain/g06/local/utils/subject';
import useModalErrorInfos from '@global/hooks/useModalErrorInfos';
import dayjs from '@global/utils/dayjs';
import showMessage from '@global/utils/showMessage';
import { getUserData } from '@global/utils/store/getUserData';
import StoreGlobalPersist from '@store/global/persist';
import { useNavigate } from '@tanstack/react-router';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';

type ActionPanelProps = {
  template: Partial<TSubjectTemplate>;
  isIndicatorUpdate: boolean;
  className?: string;
  currentStep: number;
  isSaving?: boolean;
  lastEditAt?: string | number | Date | Dayjs | null;
  lastEditBy?: string;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onSaveSuccess?: () => void;
  onCancel?: () => void;
};

const ActionPanel = ({
  className,
  template,
  isSaving,
  isIndicatorUpdate,
  currentStep,
  lastEditAt,
  lastEditBy,
  onSaveSuccess,
  onCancel,
  onNextPage,
  onPreviousPage,
}: ActionPanelProps) => {
  const { subjectData }: { subjectData: ISubject } = StoreGlobalPersist.StateGet([
    'subjectData',
  ]);
  const userData = getUserData();
  const navigate = useNavigate();

  const modalErrorInfos = useModalErrorInfos();

  const lastEdited = useMemo(() => {
    let date = lastEditAt ?? lastEditBy;
    date = dayjs(date);
    if (!date) return '-';

    const formattedDate = date.locale('th').format('D MMM BBBB HH:mm');

    return `${formattedDate} , ${lastEditBy ?? '-'}`;
  }, [lastEditAt, lastEditBy]);

  const handleCreate = async (options: { isNextStep?: boolean }) => {
    if (!template.name) {
      showMessage('กรุณากรอกชื่อ Template', 'warning');
      return;
    }

    if (!template.seed_year_id) {
      showMessage('ไม่พบ template.seed_year_id', 'error');
      return;
    }

    try {
      const res = await API.SubjectTemplate.PostSubjectTemplateCreate({
        ...template,
        name: template.name,
        seed_year_id: template.seed_year_id,
        subject_id: subjectData.id,
        wizard_index: options.isNextStep ? 2 : currentStep,
      });

      if (options.isNextStep) onNextPage?.();

      onSaveSuccess?.();

      showMessage('บันทึกข้อมูลสำเร็จ');
      navigate({ to: `../edit/${res.data.data[0].id}` });
    } catch (error) {
      throw error;
    }
  };

  const handleSave = async (options: { isNextStep?: boolean }) => {
    // validate before save
    if (!template.subject_id || !template.subject_name) {
      showMessage('กรุณาเลือกวิชา', 'error');
      return;
    }
    const errors: TErrorInfos[] = [];

    validateSubjectIndicator(
      template.subject_name,
      mapToGradeIndicators(template.subject_id, template.indicators),
      errors,
    );

    if (errors.length > 0) {
      modalErrorInfos.setErrorInfos(errors);
      showMessage('กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
      return;
    }
    modalErrorInfos.setErrorInfos(errors);

    const updatedAt = new Date().toISOString();
    try {
      await API.SubjectTemplate.PostSubjectTemplateUpdate(template.id as number, {
        ...template,
        is_indicator_update: isIndicatorUpdate,
        updated_by: userData.id,
        updated_at: updatedAt,
      });

      if (options.isNextStep && currentStep < 3) {
        onNextPage?.();
      }
      showMessage('บันทึกข้อมูลสำเร็จ');

      onSaveSuccess?.();
    } catch (error) {
      showMessage('พบปัญหาในการบันทึก', 'error');
      throw error;
    }
  };

  return (
    <CWWhiteBox
      className={cn('flex flex-row justify-between bg-neutral-100 p-4', className)}
    >
      <div className="flex gap-6">
        <CWButton
          title="บันทึก"
          disabled={isSaving}
          onClick={() => {
            if (!template.id) {
              handleCreate({ isNextStep: false });
              return;
            }

            handleSave({ isNextStep: false });
          }}
        />
        <CWButton title="ยกเลิก" type="button" outline onClick={onCancel} />

        <div className="flex flex-row items-center gap-4">
          <span> แก้ไขล่าสุด:</span>
          <span>{lastEdited} </span>
          {modalErrorInfos.isOpen && modalErrorInfos.render()}
        </div>
      </div>

      <ButtonPageSwitch
        hideNextPage={currentStep == 3}
        hidePreviousPage={currentStep == 1}
        onNextPage={() => {
          // Create
          if (!template.id) {
            handleCreate({ isNextStep: false });
            return;
          }

          let isNextStep = true;
          if (currentStep === 3) isNextStep = false;
          handleSave({ isNextStep: isNextStep });
        }}
        onPreviousPage={() => {
          onPreviousPage?.();
        }}
      />
    </CWWhiteBox>
  );
};

export default ActionPanel;
