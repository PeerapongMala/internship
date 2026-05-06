import React, { useEffect, useState } from 'react';
import Content from '../local/component/web/atom/Content';
import { useParams } from '@tanstack/react-router';
import API from '../local/api';
import { GetEvaluationForm } from '../local/api/type';
import StoreGlobalPersist from '@store/global/persist';
import { IJsonStudentScoreDaum } from '../g06-d05-p11-competencies/type';
import { IAPIResponse, IFormData } from './type';

const DomainJSX = () => {
  const { evaluationForm }: { evaluationForm: GetEvaluationForm } =
    StoreGlobalPersist.StateGet(['evaluationForm']);

  const [scoreDataRequest, setScoreDataRequest] = useState<{
    id: number;
    start_edit_at: string;
    json_student_score_data: IJsonStudentScoreDaum[];
  }>({
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
      const res = (await API.GetDetailPhorpor5(
        evaluationFormId,
        path,
        {},
      )) as IAPIResponse<IFormData[]>;

      if (res.status_code === 200 && Array.isArray(res.data) && res.data.length > 0) {
        const formData = res.data[0];
        const studentScores = Array.isArray(formData.data_json) ? formData.data_json : [];

        const requiredIndicators = [
          'รักชาติ',
          'ซื่อสัตย์',
          'มีวินัย',
          'ใฝ่เรียนรู้',
          'พอเพียง',
          'มุ่งมั่น',
          'เป็นไทย',
          'สาธารณะ',
          'ผลประเมินคุณลักษณะอันพึงประสงค์',
          'อ่าน คิดวิเคราะห์ และเขียนสื่อความ-1',
          'อ่าน คิดวิเคราะห์ และเขียนสื่อความ-2',
          'อ่าน คิดวิเคราะห์ และเขียนสื่อความ-3',
          'อ่าน คิดวิเคราะห์ และเขียนสื่อความ-4',
          'อ่าน คิดวิเคราะห์ และเขียนสื่อความ-5',
          'ผลประเมินอ่าน คิดวิเคราะห์ และเขียนสื่อความ',
        ];

        const tmpScoreDataList: IJsonStudentScoreDaum[] = [...studentScores]
          .sort((a, b) => {
            const aNo =
              formData.student_list.find(
                (s: { id: number }) => s.id === a.additional_fields?.id,
              )?.no ?? 0;
            const bNo =
              formData.student_list.find(
                (s: { id: number }) => s.id === b.additional_fields?.id,
              )?.no ?? 0;
            return aNo - bNo;
          })
          .map((studentScore) => {
            const indicators = requiredIndicators.map((indicatorName) => {
              const found = studentScore.student_indicator_data.find(
                (ind: { indicator_general_name: string }) =>
                  ind.indicator_general_name === indicatorName,
              );
              return {
                indicator_general_name: indicatorName,
                value: found ? found.value : 0,
              };
            });

            const matchingStudent = formData.student_list.find(
              (s: { id: number }) => s.id === studentScore.additional_fields?.id,
            );

            const studentDetailWithNo = {
              ...studentScore.additional_fields,
              no: typeof matchingStudent?.no === 'number' ? matchingStudent.no : 0,
            };

            return {
              evaluation_student_id: studentScore.evaluation_student_id,
              student_indicator_data: indicators,
              order: 0,
              student_detail: studentDetailWithNo,
            };
          });

        const tmpScoreDataListFinal = rankStudents(tmpScoreDataList);

        setScoreDataRequest({
          id: Number(path),
          start_edit_at: new Date().toISOString(),
          json_student_score_data: tmpScoreDataListFinal,
        });
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  function rankStudents(students: IJsonStudentScoreDaum[]): IJsonStudentScoreDaum[] {
    const scores = students.map((student) => ({
      evaluation_student_id: student.evaluation_student_id,
      totalScore: student.student_indicator_data.reduce(
        (sum, indicator) => sum + indicator.value,
        0,
      ),
    }));

    const sortedScores = [...scores].sort((a, b) => b.totalScore - a.totalScore);

    const rankingMap = new Map(
      sortedScores.map((s, index) => [s.evaluation_student_id, index + 1]),
    );

    return students.map((student) => ({
      ...student,
      order: rankingMap.get(student.evaluation_student_id) || 0,
    }));
  }

  return (
    <div>
      <Content>
        <div className="overflow-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr>
                <th
                  colSpan={1}
                  className="w-[250px] min-w-[250px] border !border-r-0 text-center"
                ></th>
                <th
                  colSpan={24}
                  className="whitespace-nowrap border !border-l-0 text-center"
                >
                  สรุปประเมินคุณลักษณะอันพึงประสงค์ - การอ่าน คิดวิเคราะห์
                  และเขียนสื่อความ ชั้น {evaluationForm.year} ปีการศึกษา{' '}
                  {evaluationForm.academic_year}
                </th>
              </tr>
              <tr>
                <th rowSpan={10} className="whitespace-nowrap border text-center">
                  ชื่อสกุล
                </th>
                <th rowSpan={3} className="whitespace-nowrap border text-center">
                  เลขที่
                </th>
                <th colSpan={12} className="whitespace-nowrap border text-center">
                  คุณลักษณะอันพึงประสงค์
                </th>
                <th colSpan={9} className="whitespace-nowrap border text-center">
                  อ่าน คิดวิเคราะห์ และเขียนสื่อความ
                </th>
              </tr>
              <tr>
                {[
                  'รักชาติ',
                  'ซื่อสัตย์',
                  'มีวินัย',
                  'ใฝ่เรียนรู้',
                  'พอเพียง',
                  'มุ่งมั่น',
                  'เป็นไทย',
                  'สาธารณะ',
                ].map((label) => (
                  <th
                    key={label}
                    rowSpan={2}
                    className="h-[100px]  border !px-0 text-center "
                  >
                    <div className="flex h-full items-center justify-center">
                      <span className="rotate-[-90deg] whitespace-nowrap text-sm leading-tight">
                        {label}
                      </span>
                    </div>
                  </th>
                ))}

                <th colSpan={4} className="border text-center">
                  ผลการประเมิน
                </th>
                {[1, 2, 3, 4, 5].map((num) => (
                  <th key={num} rowSpan={2} className="border text-center">
                    {num}
                  </th>
                ))}
                <th colSpan={4} className="border text-center">
                  ผลการประเมิน
                </th>
              </tr>
              <tr>
                {['ไม่ผ่าน', 'ผ่าน', 'ดี', 'ดีเยี่ยม'].map((text) => (
                  <th
                    key={text}
                    className="w-[60px] whitespace-nowrap border px-2 py-1 text-center text-sm"
                  >
                    {text}
                  </th>
                ))}
                {['ไม่ผ่าน', 'ผ่าน', 'ดี', 'ดีเยี่ยม'].map((text) => (
                  <th
                    key={`r2-${text}`}
                    className="w-[60px] whitespace-nowrap border px-2 py-1 text-center text-sm"
                  >
                    {text}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {scoreDataRequest.json_student_score_data.map((studentData) => {
                const indicators = studentData.student_indicator_data;

                const characteristicResult = indicators[8]?.value || 1; // ผลประเมินคุณลักษณะ
                const readingResult = indicators[14]?.value || 1; // ผลประเมินการอ่าน

                return (
                  <tr key={studentData.evaluation_student_id}>
                    <td className="min-w-[250px] whitespace-nowrap border px-3 py-1 text-left">
                      {`${studentData.student_detail?.title || ''}
                      ${studentData.student_detail?.thai_first_name || ''} 
                      ${studentData.student_detail?.thai_last_name || ''}`}
                    </td>

                    <td className="whitespace-nowrap border px-2 py-1 text-center">
                      {studentData.student_detail?.no}
                    </td>

                    {/* 8 คุณลักษณะ  */}
                    {indicators.slice(0, 8).map((indicator, idx) => (
                      <td
                        key={`ind-${idx}`}
                        className="whitespace-nowrap border px-2 py-1 text-center"
                      >
                        {indicator.value}
                      </td>
                    ))}

                    {/* 4 ช่องผลการประเมินคุณลักษณะ */}
                    <td className="whitespace-nowrap border px-2 py-1 text-center">
                      {characteristicResult === 1 ? '✓' : ''} {/* ไม่ผ่าน */}
                    </td>
                    <td className="whitespace-nowrap border px-2 py-1 text-center">
                      {characteristicResult === 2 ? '✓' : ''} {/* ผ่าน */}
                    </td>

                    <td className="whitespace-nowrap border px-2 py-1 text-center">
                      {characteristicResult === 3 ? '✓' : ''} {/* ดี */}
                    </td>
                    <td className="whitespace-nowrap border px-2 py-1 text-center">
                      {characteristicResult === 4 ? '✓' : ''} {/* ดีเยี่ยม */}
                    </td>

                    {/* คะแนน 1–5 */}
                    {indicators.slice(9, 14).map((indicator, idx) => (
                      <td
                        key={`score-${idx}`}
                        className="whitespace-nowrap border px-2 py-1 text-center"
                      >
                        {indicator.value}
                      </td>
                    ))}

                    {/* 4 ช่องผลการประเมินการอ่าน */}
                    <td className="whitespace-nowrap border px-2 py-1 text-center">
                      {readingResult === 1 ? '✓' : ''} {/* ไม่ผ่าน */}
                    </td>
                    <td className="whitespace-nowrap border px-2 py-1 text-center">
                      {readingResult === 2 ? '✓' : ''} {/* ผ่าน */}
                    </td>
                    <td className="whitespace-nowrap border px-2 py-1 text-center">
                      {readingResult === 3 ? '✓' : ''} {/* ดี */}
                    </td>
                    <td className="whitespace-nowrap border px-2 py-1 text-center">
                      {readingResult === 4 ? '✓' : ''} {/* ดีเยี่ยม */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Content>
    </div>
  );
};

export default DomainJSX;
