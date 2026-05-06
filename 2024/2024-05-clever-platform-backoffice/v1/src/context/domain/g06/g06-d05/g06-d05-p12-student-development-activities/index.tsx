import React, { useEffect, useState } from 'react';
import Content from '../local/component/web/atom/Content';
import { useParams } from '@tanstack/react-router';
import API from '../local/api';
import {
  IJsonStudentScoreDaum,
  IUpdateSheetRequest,
} from '@domain/g06/g06-d03/local/type';
import { GetEvaluationForm } from '../local/api/type';
import StoreGlobalPersist from '@store/global/persist';

const DomainJSX = () => {
  const { evaluationForm }: { evaluationForm: GetEvaluationForm } =
    StoreGlobalPersist.StateGet(['evaluationForm']);

  const [scoreDataRequest, setScoreDataRequest] = useState<IUpdateSheetRequest>({
    start_edit_at: new Date().toISOString(),
    json_student_score_data: [],
    id: 0,
  });

  const { evaluationFormId, path } = useParams({ strict: false });

  useEffect(() => {
    if (evaluationFormId) {
      fetchData();
    }
  }, [evaluationFormId]);

  const fetchData = async () => {
    try {
      const res = await API.GetDetailPhorpor5(evaluationFormId, path, {});
      if (res?.status_code !== 200) {
        console.log('API error:', res);
        return;
      }

      if (Array.isArray(res.data) && res.data.length > 0) {
        const firstData = res.data[0] as any;

        const studentMap = new Map<number, any>();
        firstData.student_list.forEach((student: any) => {
          studentMap.set(student.id, student);
        });

        const json_student_score_data: IJsonStudentScoreDaum[] = firstData.data_json.map(
          (scoreItem: any, index: number) => {
            const student_detail =
              studentMap.get(scoreItem.evaluation_student_id) ?? null;

            const student_indicator_data = scoreItem.student_indicator_data.map(
              (indicator: any) => ({
                ...indicator,
                indicator_id: indicator.indicator_id ?? undefined,
              }),
            );

            return {
              ...scoreItem,
              student_indicator_data,
              student_detail,
              order: index + 1,
            };
          },
        );

        setScoreDataRequest({
          id: firstData.id,
          start_edit_at: new Date().toISOString(),
          json_student_score_data,
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div>
      <Content>
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr>
              <th colSpan={12} className="border py-2 text-center font-medium">
                สรุปการประเมินกิจกรรมพัฒนาผู้เรียน ชั้น {evaluationForm.year} ปีการศึกษา{' '}
                {evaluationForm.academic_year}
              </th>
            </tr>
            <tr>
              <th rowSpan={3} className="border px-4 py-2 text-center">
                ชื่อสกุล
              </th>
              <th rowSpan={3} className="border px-2 py-2 text-center">
                เลขที่
              </th>
              <th colSpan={2} className="border text-center">
                แนะแนว
              </th>
              <th colSpan={2} className="border text-center">
                ลูกเสือ-เนตรนารี
              </th>
              <th colSpan={4} className="border text-center">
                ชุมนุม
              </th>
              <th colSpan={2} className="border text-center">
                กิจกรรมเพื่อสังคม
                <br />
                และสาธารณประโยชน์
              </th>
            </tr>
            <tr>
              <th className="border px-2">ผ่าน</th>
              <th className="border px-2">ไม่ผ่าน</th>
              <th className="border px-2">ผ่าน</th>
              <th className="border px-2">ไม่ผ่าน</th>
              <th colSpan={2} className="border px-2">
                ชื่อชุมนุม
              </th>
              <th className="border px-2">ผ่าน</th>
              <th className="border px-2">ไม่ผ่าน</th>
              <th className="border px-2">ผ่าน</th>
              <th className="border px-2">ไม่ผ่าน</th>
            </tr>
          </thead>

          <tbody>
            {scoreDataRequest.json_student_score_data?.map((studentData, idx) => (
              <tr key={idx}>
                <td className="whitespace-nowrap border px-4 py-1">
                  {studentData.student_detail?.title}
                  {studentData.student_detail?.thai_first_name}{' '}
                  {studentData.student_detail?.thai_last_name}
                </td>
                <td className="border px-2 py-1 text-center">
                  {studentData.student_detail?.no}
                </td>

                {studentData.student_indicator_data.map((indicatorData, idxIndicator) => {
                  if ([0, 1, 3].includes(idxIndicator)) {
                    return (
                      <React.Fragment key={idxIndicator}>
                        <td className="border px-2 py-1 text-center">
                          {indicatorData.value === 1 ? '✓' : ''}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {indicatorData.value === 0 ? '✓' : ''}
                        </td>
                      </React.Fragment>
                    );
                  }

                  if (idxIndicator === 2) {
                    return (
                      <React.Fragment key={idxIndicator}>
                        <td colSpan={2} className="border px-2 py-1 text-center">
                          {indicatorData.additional_fields?.['ชื่อชุมนุม'] || ''}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {indicatorData.value === 1 ? '✓' : ''}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {indicatorData.value === 0 ? '✓' : ''}
                        </td>
                      </React.Fragment>
                    );
                  }

                  return null;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Content>
    </div>
  );
};

export default DomainJSX;
