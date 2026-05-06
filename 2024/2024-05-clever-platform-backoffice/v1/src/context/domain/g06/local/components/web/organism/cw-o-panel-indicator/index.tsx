import CWButton from '@component/web/cw-button';
import ItemIndicator from '../../molecule/cw-m-item-indicator';
import useModal from '@global/utils/useModal';
import ModalConfigIndicatorEvaluationCriteria from '../cw-o-modal-config-indicator-evaluation-criteria';
import { TContentIndicator, TContentSubject } from '@domain/g06/local/types/content';

type PanelIndicatorProps = {
  viewOnly?: boolean;
  isAcademicContext?: boolean;
  disabledEdit?: boolean;
  required?: boolean;
  subject: TContentSubject;
  onSubjectChange?: (subject: TContentSubject) => void;
};

const PanelIndicator = ({
  viewOnly,
  isAcademicContext,
  disabledEdit,
  required,
  subject,
  onSubjectChange,
}: PanelIndicatorProps) => {
  // Add Indicator Modal
  const { isOpen, open, close } = useModal();

  // Created indicator will always negative number.
  // for identification. ID will removed when called api.
  const handleAddIndicator = (newIndicator: TContentIndicator) => {
    let indicatorLength = subject?.indicator?.length ?? 0;
    const newIndicatorID = -(indicatorLength + 1);

    const indicators: TContentIndicator[] = [
      ...subject.indicator,
      { ...newIndicator, id: newIndicatorID },
    ];

    handleSubjectChange(indicators);
  };

  const handleEditIndicator = (updatedIndicator: TContentIndicator) => {
    const indicators: TContentIndicator[] = subject.indicator.map((indicator) => {
      // updated
      if (indicator.id === updatedIndicator.id) {
        return updatedIndicator;
      }
      // created
      return indicator;
    });

    handleSubjectChange(indicators);
  };

  const handleShowDeleteIndicatorButton = (indicator: TContentIndicator): boolean => {
    return true;
  };
  const handleDeleteIndicator = (selectedIndex: number) => {
    const indicators = subject.indicator.filter((_, i) => i !== selectedIndex);

    handleSubjectChange(indicators);
  };

  const handleSubjectChange = (indicators: TContentIndicator[]) => {
    const transformIndicator = indicators.map((indicator, i) => {
      return {
        ...indicator,
        sort: i + 1,
      };
    });

    onSubjectChange?.({ ...subject, indicator: transformIndicator });
  };

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-6 border-y border-slate-200 py-5">
          {/* Indicator Lists */}
          {subject.indicator.map((indicator, i) => (
            <ItemIndicator
              isAcademicContext={isAcademicContext}
              disabledEdit={disabledEdit}
              subjectID={subject.clever_subject_id}
              key={`item-indicator-${i}`}
              onClickEdit={() => {}}
              label={`ตัวชี้วัดที่ ${i + 1}`}
              indicator={indicator}
              onChange={handleEditIndicator}
              onDelete={() => handleDeleteIndicator(i)}
              deleteAble={handleShowDeleteIndicatorButton(indicator)}
              required={!disabledEdit && required}
            />
          ))}
        </div>

        <div>
          {/* Button to open "Add Indicator Modal"  */}
          {!disabledEdit && (
            <CWButton
              title="เพิ่มตัวชี้วัด"
              className="w-fit"
              outline
              type="button"
              onClick={() => {
                open();
              }}
            />
          )}

          {/* Add Indicator Modal */}
          {isOpen && (
            <ModalConfigIndicatorEvaluationCriteria
              viewOnly={viewOnly}
              isAcademicContext={isAcademicContext}
              subjectID={subject.clever_subject_id}
              evaluationFormSubjectID={subject.id}
              title="เพิ่มตัวชี้วัดการตั้งค่าประเมินคะแนน"
              isOpen={isOpen}
              onClose={close}
              onSave={(indicator) => {
                handleAddIndicator(indicator);
                close();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelIndicator;
