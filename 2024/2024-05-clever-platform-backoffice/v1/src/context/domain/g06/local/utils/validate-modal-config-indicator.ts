import showMessage from '@global/utils/showMessage';
import { TContentIndicator } from '../types/content';
import { EScoreEvaluationType } from '../enums/evaluation';
import { isSelectedAtLeastOneLevel } from './level';

export function validateModalConfigIndicator(indicator: TContentIndicator): boolean {
  if (!indicator.max_value || indicator.max_value <= 0) {
    showMessage('กรุณากรอกคะแนนเต็ม', 'warning');
    return false;
  }

  if (
    indicator.score_evaluation_type === EScoreEvaluationType.ACADEMIC_CRITERIA ||
    indicator.score_evaluation_type === EScoreEvaluationType.TEACHER_CRITERIA
  ) {
    return validateClever(indicator);
  }

  if (indicator.score_evaluation_type === EScoreEvaluationType.NO_CRITERIA) {
    return validateNoCriteria(indicator);
  }

  showMessage('ไม่พบเกณฑ์หลักการประเมินคะแนน', 'error');
  return false;
}

function validateClever(indicator: TContentIndicator): boolean {
  if (!indicator.clever_lesson_id) {
    showMessage('กรุณาเลือกบทเรียนหลัก', 'warning');
    return false;
  }

  if (!indicator.clever_sub_lesson_id) {
    showMessage('กรุณาเลือกบทเรียนย่อย', 'warning');
    return false;
  }

  if (!indicator.setting) {
    showMessage('กรุณาเลือกด่านอย่างน้อย 1 ด่าน', 'warning');
    return false;
  }

  // if (!isSelectedAtLeastOneLevel(indicator.setting)) {
  //   showMessage('กรุณาเลือกด่านอย่างน้อย 1 ด่าน', 'warning');
  //   return false;
  // }

  // check if selected level already input weight
  for (let i = 0; i < indicator.setting.length; i++) {
    let setting = indicator.setting?.[i];

    if (/\d/.test(setting.value)) {
      if (!setting.weight) {
        showMessage('กรุณากรอกน้ำหนักให้ครบถ้วน', 'warning');
        return false;
      }
    }
  }

  return true;
}

function validateNoCriteria(indicator: TContentIndicator): boolean {
  let passed = true;

  if (!indicator.name) {
    showMessage('กรุณากรอกชื่อตัวชี้วัด', 'warning');
    passed = false;
  }

  return passed;
}
