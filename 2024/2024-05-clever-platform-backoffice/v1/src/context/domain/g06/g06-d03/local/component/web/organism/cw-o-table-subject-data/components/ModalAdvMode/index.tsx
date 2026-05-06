import ModalConfigIndicatorEvaluationCriteria, {
  ModalConfigIndicatorEvaluationCriteriaProps,
} from '@domain/g06/local/components/web/organism/cw-o-modal-config-indicator-evaluation-criteria';

import {
  IGetSheetDetail,
  IStudentIndicatorDaum,
  IUpdateSheetRequest,
  TOnInputScoreChange,
} from '@domain/g06/g06-d03/local/type';

type ModalAdvModeProps = Omit<
  ModalConfigIndicatorEvaluationCriteriaProps,
  | 'enabledAdvMode'
  | 'title'
  | 'subjectID'
  | 'indicator'
  | 'onSave'
  | 'additionalFields'
  | 'maxScore'
  | 'currentScore'
  | 'studentID'
> & {
  isOpen: boolean;
  onClose: () => void;
  selectedScoreIndex: [row: number, col: number];
  sheetDetail?: IGetSheetDetail;
  studentScoreData: IUpdateSheetRequest;
  onHandleScoreChange: TOnInputScoreChange;
};

const ModalAdvMode = ({
  isOpen,
  onClose,
  selectedScoreIndex: [row, col],
  sheetDetail,
  studentScoreData,
  onHandleScoreChange,
  ...props
}: ModalAdvModeProps) => {
  const student = studentScoreData.json_student_score_data?.[row];
  if (!student) return null;

  const indicatorData = student.student_indicator_data?.[col];
  if (!indicatorData) return null;

  const indicator = sheetDetail?.subject_data?.indicator.find(
    (i) => i.id == indicatorData.indicator_id,
  );

  const title =
    `${student.student_detail?.thai_first_name ?? ''} ${student.student_detail?.thai_last_name ?? ''}`.trim();

  return (
    <ModalConfigIndicatorEvaluationCriteria
      enabledAdvMode
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subjectID={sheetDetail?.subject_data?.clever_subject_id}
      indicator={indicator}
      additionalFields={indicatorData.additional_fields}
      maxScore={indicator?.max_value}
      currentScore={indicatorData.value}
      studentID={student.evaluation_student_id}
      onSave={(_, additionalField) => {
        const score = additionalField?.value;

        onHandleScoreChange(
          // handleScoreChange expects an event-like object
          { target: { value: score ?? 0 } } as any,
          row,
          col,
          {
            ...indicatorData,
            additional_fields: {
              game_score: additionalField?.game_score,
              is_replace_score: additionalField?.is_replace_score,
              replaced_score: additionalField?.replaced_score,
            },
          } as IStudentIndicatorDaum,
        );

        onClose();
      }}
      sheetIndicatorID={indicator?.id}
      {...props}
    />
  );
};

export default ModalAdvMode;
