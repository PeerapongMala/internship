import { TErrorInfos } from '@component/web/cw-modal/cw-modal-error-infos/type';
import { Subjects } from '../api/type';

const CONTEXT_SUBJECT = 'วิชา';

export function validateSubjects(subjects: Subjects[], errors: TErrorInfos[]) {
  if (!subjects || subjects.length == 0) {
    errors.push({ context: CONTEXT_SUBJECT, message: 'กรุณาเพิ่มวิชาอย่างน้อย 1 วิชา' });
  }

  // validate each subject
  subjects?.forEach?.((value, index) => validateSubject(value, index, errors));

  return errors.length > 0;
}
// validate each subject
function validateSubject(subject: Subjects, index: number, errors: TErrorInfos[]) {
  let subjectName = `${CONTEXT_SUBJECT}${subject.subject_name}`;

  if (!subject.subject_name) {
    subjectName += `ที่ ${index + 1}`;
    errors.push({
      context: subjectName,
      message: 'กรุณากรอกชื่อวิชา',
    });
  }

  if (typeof subject.is_clever != 'boolean') {
    errors.push({
      context: subjectName,
      message: 'กรุณาเลือกการเชื่อมต่อข้อมูลกับ Clever',
    });
  }

  if (subject.is_clever && !subject.clever_subject_id) {
    errors.push({
      context: subjectName,
      message: 'กรุณาเลือกวิชา Clever',
    });
  }

  if (!subject.subject_no) {
    errors.push({
      context: subjectName,
      message: 'กรุณากรอกรหัสวิชา',
    });
  }

  if (!subject.learning_area) {
    errors.push({
      context: subjectName,
      message: 'กรุณากรอกกลุ่มสาระการเรียนรู้',
    });
  }

  if (!subject.hours) {
    errors.push({
      context: subjectName,
      message: 'กรุณากรอกเวลาเรียน',
    });
  }

  if (subject.is_extra == null) {
    errors.push({
      context: subjectName,
      message: 'กรุณาเลือก วิชาพื้นฐาน/เพิ่มเติม',
    });
  }

  if (!subject.credits || subject.credits <= 0) {
    errors.push({
      context: subjectName,
      message: 'กรุณากรอก หน่วยกิต',
    });
  }
}
