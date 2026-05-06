import { TErrorInfos } from '@component/web/cw-modal/cw-modal-error-infos/type';
import { TContentIndicator, TContentSubject } from '../types/content';

export function validateSubjectsIndicator(
  subjects: TContentSubject[],
  errors: TErrorInfos[],
) {
  subjects.forEach((subject) => {
    if (!subject.indicator || subject.indicator.length == 0) return;
    validateSubjectIndicator(subject.subject_name, subject.indicator, errors);
  });
}

export function validateSubjectIndicator(
  subjectName: string | null,
  indicators: TContentIndicator[],
  errors: TErrorInfos[],
) {
  indicators.forEach((indicator, i) => {
    if (!indicator.max_value) {
      errors.push({
        context: <span>{`วิชา ${subjectName} - ตัวชี้วัดที่ ${i + 1}`}</span>,
        message: 'กรุณากรอกคะแนนเต็ม',
      });
    }
  });
}
