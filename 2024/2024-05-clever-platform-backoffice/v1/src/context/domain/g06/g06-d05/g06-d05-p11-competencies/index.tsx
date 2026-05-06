import React, { useEffect, useState } from 'react';

import Content from '../local/component/web/atom/Content';
import { useParams } from '@tanstack/react-router';
import API from '../local/api';
import {
  IJsonStudentScoreDaum,
  IStudent,
  IStudentIndicatorDaum,
  IUpdateSheetRequest,
  IGetSheetDetail,
} from '@domain/g06/g06-d03/local/type';
import {
  GetEvaluationForm,
  IGetPhorpor5Detail,
  NutritionResponse,
} from '../local/api/type';
import StoreGlobalPersist from '@store/global/persist';

const DomainJSX = () => {
  const { evaluationForm }: { evaluationForm: GetEvaluationForm } =
    StoreGlobalPersist.StateGet(['evaluationForm']);

  const [detailData, setDetailData] = useState<IGetPhorpor5Detail>();

  const [modeStats, setModeStats] = useState({
    score12345: [0, 0, 0, 0, 0],
    scoreEvaluate: [0, 0, 0, 0],
  });

  const { evaluationFormId, path } = useParams({
    strict: false,
  });

  useEffect(() => {
    if (evaluationFormId) {
      fetchData();
    }
  }, [evaluationFormId]);

  const fetchData = async () => {
    try {
      const res = await API.GetDetailPhorpor5(evaluationFormId, path, {});

      if (res?.status_code !== 200) {
        console.error('Failed to fetch data:', res);
        return;
      }

      const data = (Array.isArray(res.data)
        ? res.data[0]
        : res.data) as unknown as IGetPhorpor5Detail;

      const tmpScoreDataList: IJsonStudentScoreDaum[] = [];
      const scoreCounts12345 = [0, 0, 0, 0, 0];
      const scoreCountsEvaluate = [0, 0, 0, 0];

      setDetailData(data);
      console.log(data);

      setModeStats({
        score12345: scoreCounts12345,
        scoreEvaluate: scoreCountsEvaluate,
      });
    } catch (error) {
      console.error('Error fetching detail:', error);
    }
  };

  // useEffect(() => {
  //   console.log(scoreDataRequest);
  // }, [scoreDataRequest]);

  return (
    <div>
      <Content>
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr>
              <th colSpan={11} className="whitespace-nowrap border px-2 py-1 text-center">
                สรุปประเมินคุณลักษณะอันพึงประสงค์ - การอ่าน คิดวิเคราะห์ และเขียนสื่อความ
                ชั้น {evaluationForm.year} ปีการศึกษา {evaluationForm.academic_year}
              </th>
            </tr>
            <tr>
              <th rowSpan={3} className="whitespace-nowrap border px-2 py-1 text-center">
                ชื่อสกุล
              </th>
              <th rowSpan={3} className="whitespace-nowrap border px-2 py-1 text-center">
                เลขที่
              </th>
              <th colSpan={9} className="whitespace-nowrap border px-2 py-1 text-center">
                สมรรถนะสำคัญของผู้เรียน
              </th>
            </tr>
            <tr>
              <th className="whitespace-nowrap border px-2 py-1 text-center" rowSpan={2}>
                1
              </th>
              <th className="whitespace-nowrap border px-2 py-1 text-center" rowSpan={2}>
                2
              </th>
              <th className="whitespace-nowrap border px-2 py-1 text-center" rowSpan={2}>
                3
              </th>
              <th className="whitespace-nowrap border px-2 py-1 text-center" rowSpan={2}>
                4
              </th>
              <th className="whitespace-nowrap border px-2 py-1 text-center" rowSpan={2}>
                5
              </th>
              <th className="whitespace-nowrap border px-2 py-1 text-center" colSpan={4}>
                ผลการประเมิน
              </th>
            </tr>
            <tr>
              <th className="w-24 whitespace-nowrap border px-2 py-1 text-center">
                ไม่ผ่าน
              </th>
              <th className="w-24 whitespace-nowrap border px-2 py-1 text-center">
                ผ่าน
              </th>
              <th className="w-24 whitespace-nowrap border px-2 py-1 text-center">ดี</th>
              <th className="w-24 whitespace-nowrap border px-2 py-1 text-center">
                ดีเยี่ยม
              </th>
            </tr>
          </thead>

          <tbody>
            {(detailData as any as NutritionResponse)?.data_json?.map?.(
              (studentData, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap border px-2 py-1">
                    {studentData.additional_fields.title ?? '-'}
                    {studentData.additional_fields?.thai_first_name ?? '-'}{' '}
                    {studentData.additional_fields?.thai_last_name ?? '-'}
                  </td>
                  <td className="whitespace-nowrap border px-2 py-1 text-center">
                    {index + 1}
                  </td>
                  {/* สมรรถนะ 1–5 (index 0–4) */}
                  {studentData.student_indicator_data
                    .slice(0, 5)
                    .map((indicator, idx) => (
                      <td
                        key={`competency-${idx}`}
                        className="whitespace-nowrap border px-2 py-1 text-center"
                      >
                        {indicator.value}
                      </td>
                    ))}
                  {/* ผลการประเมิน: ใช้ค่า value จาก competency-6 (index 5) */}
                  {[0, 1, 2, 3].map((val) => (
                    <td
                      key={`eval-${val}`}
                      className="whitespace-nowrap border px-2 py-1 text-center"
                    >
                      {studentData.student_indicator_data[5]?.value === val + 1 ? '✓' : ''}
                    </td>
                  ))}
                </tr>
              ),
            )}
          </tbody>
        </table>
        <div className="p-3 text-sm leading-relaxed">
          <div className="mb-2 ml-48 font-bold">
            เกณฑ์การประเมินสมรรถนะสำคัญของผู้เรียน
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            <div className="ml-48 flex items-center gap-1">
              <span>คะแนน</span>
              <span className="font-bold">3</span>
              <span>ระดับคุณภาพ ดีเยี่ยม</span>
            </div>
            <div className="flex items-center gap-1">
              <span>คะแนน</span>
              <span className="font-bold">2</span>
              <span>ระดับคุณภาพ ดี</span>
            </div>
            <div className="ml-48 flex items-center gap-1">
              <span>คะแนน</span>
              <span className="font-bold">1</span>
              <span>ระดับคุณภาพ ผ่าน</span>
            </div>
            <div className="flex items-center gap-1">
              <span>คะแนน</span>
              <span className="font-bold">0</span>
              <span>ระดับคุณภาพ ไม่ผ่าน</span>
            </div>

            <div></div>

            <div className="flex items-center gap-1">
              <span>ลงชื่อ</span>
              <span>....................</span>
              <span>ครูประจำชั้น/ครูประจำวิชา</span>
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default DomainJSX;
