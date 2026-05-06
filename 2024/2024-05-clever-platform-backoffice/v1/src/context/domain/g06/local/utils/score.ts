import { ATTENDANCE_SCORE_VALUE } from '../constant/score';

export const mapToAttendanceScore = (value: string) => {
  return ATTENDANCE_SCORE_VALUE[value] ?? 0;
};

// floating point comparison
export function areFloatsEqual(a: number, b: number, tolerance = 0.001) {
  if (isNaN(a) || isNaN(b)) {
    return false;
  }
  return Math.abs(a - b) < tolerance;
}
