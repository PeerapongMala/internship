import { TContentIndicator } from '@domain/g06/local/types/content';
import { TSubjectTemplateIndicator } from '@domain/g06/local/types/subject-template';

export function mapToGradeIndicators(
  subjectID: number,
  templateIn?: TSubjectTemplateIndicator[],
): TContentIndicator[] {
  if (!templateIn || templateIn.length == 0) {
    return [];
  }

  const indicators: TContentIndicator[] = templateIn.map((indicator, index) => ({
    ...indicator,
    max_value: indicator.value,
    clever_lesson_id: indicator.lesson_id,
    clever_sub_lesson_id: indicator.sub_lesson_id,
    evaluation_form_subject_id: subjectID,
    score_evaluation_type: indicator.type,
    sort: index + 1,
  }));

  return indicators;
}
