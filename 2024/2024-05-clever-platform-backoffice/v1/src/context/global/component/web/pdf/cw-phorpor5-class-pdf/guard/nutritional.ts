// utils/getNutritionalInfo.ts

import { IGetPhorpor5Detail } from '@domain/g06/g06-d05/local/api/type';
import {
  EvaluationStudent,
  Nutritional,
} from '@domain/g06/g06-d05/g06-d05-p08-nutritional-summary/type';

export function getNutritionalInfo(data: IGetPhorpor5Detail[]): {
  students: EvaluationStudent[];
  dates: string[];
} {
  const target = data.find((item) => item.name === 'ภาวะโภชนาการ');

  const isEvaluationData = (data: any): data is Nutritional =>
    data &&
    Array.isArray(data.data_json) &&
    data.data_json.every(
      (d: any) =>
        typeof d.evaluation_student_id === 'number' &&
        Array.isArray(d.student_indicator_data) &&
        typeof d.additional_fields?.thai_first_name === 'string',
    );

  if (target && isEvaluationData(target)) {
    const students = target.data_json;

    const dates: string[] =
      target.additional_data?.nutrition?.flatMap((innerArray: any[]) =>
        innerArray.flatMap((item: { date: string }) =>
          typeof item.date === 'string' ? [item.date] : [],
        ),
      ) ?? [];

    return { students, dates };
  }

  return { students: [], dates: [] };
}
