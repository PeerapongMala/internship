import { EGradeStatus } from '@domain/g06/local/enums/grade';
import {
  IGetSheetDetail,
  IJsonStudentScoreDaum,
  IStudentIndicatorDaum,
} from '../../type';
import { rankStudents } from '../score';

/**
 * Processes API response data for a "subject" type sheet.
 * It builds the initial score structure for each student and indicator,
 * maps existing scores, and handles data migration from older formats.
 *
 * @param {IGetSheetDetail} sheetData - The full sheet detail object from the API response.
 * @returns {IJsonStudentScoreDaum[]} The processed and ranked student score data ready for state.
 */
export const processSubjectScoreData = (
  sheetData: IGetSheetDetail,
  options?: { disableGameScoreMap?: boolean },
): IJsonStudentScoreDaum[] => {
  // Guard clause in case subject_data or student_list is missing
  if (!sheetData.subject_data || !sheetData.student_list) {
    return [];
  }

  // --- MODIFIED: Create a lookup map for the entire student score object ---
  const studentScoreMap = new Map<number, IJsonStudentScoreDaum>();
  sheetData.json_student_score_data.forEach((studentScore) => {
    studentScoreMap.set(studentScore.evaluation_student_id, studentScore);
  });

  const scoreMap = new Map<number, Map<number, IStudentIndicatorDaum>>();
  sheetData.json_student_score_data.forEach((studentScore) => {
    const indicatorMap = new Map<number, IStudentIndicatorDaum>();
    studentScore.student_indicator_data.forEach((indicatorScore) => {
      if (indicatorScore.indicator_id) {
        indicatorMap.set(indicatorScore.indicator_id, indicatorScore);
      }
    });
    scoreMap.set(studentScore.evaluation_student_id, indicatorMap);
  });

  // --- Main Logic: Build the score data list for all students ---
  let tmpScoreDataList: IJsonStudentScoreDaum[] = sheetData.student_list.map(
    (student) => {
      // MODIFIED: Look up the existing data for the current student
      const existingStudentData = studentScoreMap.get(student.id);

      const studentIndicators = sheetData.subject_data!.indicator.map(
        (indicator): IStudentIndicatorDaum => {
          const existingScoreData = scoreMap.get(student.id)?.get(indicator.id);
          return {
            indicator_id: indicator.id,
            value: existingScoreData?.value ?? 0,
            ...existingScoreData,
          };
        },
      );

      return {
        student_detail: student,
        evaluation_student_id: student.id,
        student_indicator_data: studentIndicators,
        order: 0,
        // MODIFIED: Merge defaults with existing data
        additional_fields: {
          // 1. Set the default values first
          grade_status: EGradeStatus.PASSED,
          remark: '',
          // 2. Spread any existing data to overwrite the defaults
          ...existingStudentData?.additional_fields,
        },
      };
    },
  );

  // --- Backward Compatibility ---
  const hasNewData = sheetData.json_student_score_data?.length > 0;
  const hasOldData = sheetData.student_lesson_score?.length > 0;

  if (!options?.disableGameScoreMap && !hasNewData && hasOldData) {
    sheetData.student_lesson_score.forEach((cleverData) => {
      const studentIndex = tmpScoreDataList.findIndex(
        (data) => data.evaluation_student_id === cleverData.evaluation_student_id,
      );
      if (studentIndex === -1) return;

      const indicatorIndex = tmpScoreDataList[
        studentIndex
      ].student_indicator_data.findIndex(
        (data) => data.indicator_id === cleverData.evaluation_form_indicator_id,
      );
      if (indicatorIndex === -1) return;

      const indicatorData =
        tmpScoreDataList[studentIndex].student_indicator_data[indicatorIndex];

      indicatorData.value = cleverData.score;

      // Check if additional_fields exists. If not, initialize it.
      if (!indicatorData.additional_fields) {
        indicatorData.additional_fields = {};
      }

      // Now you can safely set properties on additional_fields
      indicatorData.additional_fields.is_replace_score = false;
      indicatorData.additional_fields.game_score = cleverData.score;
    });
  }

  return rankStudents(tmpScoreDataList);
};
