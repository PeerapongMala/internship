import { TContentIndicator } from '@domain/g06/local/types/content';
import { IJsonStudentScoreDaum } from '../type';
import API from '../api';

// competition ranking
export function rankStudents(students: IJsonStudentScoreDaum[]): IJsonStudentScoreDaum[] {
  const scores = students.map((student) => ({
    evaluation_student_id: student.evaluation_student_id,
    totalScore: student.student_indicator_data.reduce(
      (sum, indicator) => sum + Number(indicator.value),
      0,
    ),
  }));

  // Sort descending by score
  const sortedScores = [...scores].sort((a, b) => b.totalScore - a.totalScore);

  // Create ranking map using competition ranking (1, 2, 2, 4)
  const rankingMap = new Map<string | number, number>();
  let currentRank = 1;

  for (let i = 0; i < sortedScores.length; i++) {
    const { evaluation_student_id, totalScore } = sortedScores[i];
    if (i > 0 && totalScore === sortedScores[i - 1].totalScore) {
      // Same rank as previous
      rankingMap.set(evaluation_student_id, currentRank);
    } else {
      // New rank = i + 1
      currentRank = i + 1;
      rankingMap.set(evaluation_student_id, currentRank);
    }
  }

  // Apply ranking to original students
  return students.map((student) => ({
    ...student,
    order: rankingMap.get(student.evaluation_student_id) || 0,
  }));
}

/**
 * Fetches recalculated scores for a single updated indicator and merges them
 * with the current student score data.
 * @returns The new, merged, and ranked student score data array.
 * @throws An error if the API call or processing fails.
 */
export async function updateScoresForIndicator(
  sheetId: number,
  updatedIndicator: TContentIndicator,
  currentStudentData: IJsonStudentScoreDaum[],
): Promise<IJsonStudentScoreDaum[]> {
  if (updatedIndicator.id === undefined) {
    throw new Error('Cannot refresh scores: Indicator ID is missing.');
  }

  // 1. Fetch the sheet to get the backend's recalculated scores
  const res = await API.sheet.GetSheet(sheetId);
  if (res.status_code !== 200) {
    throw new Error('Failed to fetch updated scores from the server.');
  }
  const refreshedSheetData = res.data;

  // 2. Create a targeted map from `student_lesson_score`
  const newColumnScores = new Map<string | number, number>();
  refreshedSheetData.student_lesson_score?.forEach((recalculatedScore) => {
    if (recalculatedScore.evaluation_form_indicator_id === updatedIndicator.id) {
      newColumnScores.set(
        recalculatedScore.evaluation_student_id,
        recalculatedScore.score,
      );
    }
  });

  // 3. Merge the new scores into the current data
  const updatedStudentData = currentStudentData.map((student) => {
    const newScoreForThisStudent = newColumnScores.get(student.evaluation_student_id);
    if (newScoreForThisStudent === undefined) {
      return student; // No new score, return unchanged
    }
    const newIndicatorData = student.student_indicator_data.map((indicator) => {
      if (indicator.indicator_id === updatedIndicator.id) {
        return {
          ...indicator,
          value: newScoreForThisStudent,
          additional_fields: {
            is_replace_score: false,
            game_score: newScoreForThisStudent,
          },
        };
      }
      return indicator;
    });
    return { ...student, student_indicator_data: newIndicatorData };
  });

  // 4. Re-rank and return the final data
  return rankStudents(updatedStudentData);
}
