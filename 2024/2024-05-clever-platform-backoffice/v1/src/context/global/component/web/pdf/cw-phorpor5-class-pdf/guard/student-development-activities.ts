import { IGetPhorpor5Detail } from '@domain/g06/g06-d05/local/api/type';
import { IJsonStudentScoreDaum } from '@domain/g06/g06-d03/local/type';

export function getStudentActivitie(data: IGetPhorpor5Detail[]): {
  scoreDataRequest: {
    json_student_score_data: IJsonStudentScoreDaum[];
    id?: number;
    start_edit_at?: string;
  };
} {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      scoreDataRequest: {
        json_student_score_data: [],
        id: 0,
        start_edit_at: new Date().toISOString(),
      },
    };
  }

  const firstData = data[0] as any;

  const studentMap = new Map<number, any>();
  firstData.student_list?.forEach((student: any) => {
    studentMap.set(student.id, student);
  });

  const json_student_score_data: IJsonStudentScoreDaum[] =
    firstData.data_json?.map((scoreItem: any, index: number) => {
      const student_detail = studentMap.get(scoreItem.evaluation_student_id) ?? null;

      const student_indicator_data =
        scoreItem.student_indicator_data?.map((indicator: any) => ({
          ...indicator,
          indicator_id: indicator.indicator_id ?? undefined,
        })) || [];

      return {
        ...scoreItem,
        student_indicator_data,
        student_detail,
        order: index + 1,
      };
    }) || [];

  return {
    scoreDataRequest: {
      id: firstData.id,
      start_edit_at: new Date().toISOString(),
      json_student_score_data,
    },
  };
}
