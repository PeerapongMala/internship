import { useEffect, useState } from 'react';
import Content from '../local/component/web/atom/Content';
import { useParams } from '@tanstack/react-router';
import API from '../local/api';
import { EvaluationStudent, Nutritional } from './type';
import dayjs from 'dayjs';

const DomainJSX = () => {
  const { evaluationFormId, path } = useParams({ strict: false });

  const [nutritionalData, setNutritionalData] = useState<EvaluationStudent[]>([]);
  const [nutritionDates, setNutritionDates] = useState<string[]>([]);

  useEffect(() => {
    if (evaluationFormId) {
      fetchData();
    }
  }, [evaluationFormId]);

  const fetchData = async () => {
    try {
      const res = await API.GetDetailPhorpor5(evaluationFormId, path, {});

      if (res?.status_code === 200 && Array.isArray(res.data)) {
        const target = res.data.find((item: any) => item.name === 'ภาวะโภชนาการ');

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
          setNutritionalData(target.data_json);

          const dates: string[] =
            target?.additional_data?.nutrition?.flat().map((d: any) => d.date) ?? [];
          setNutritionDates(dates);
        } else {
          console.warn('Target found but not a valid Nutritional type');
        }
      }
    } catch (err) {
      console.error('Failed to fetch nutritional data:', err);
    }
  };

  const indicatorLabels = [
    'น้ำหนัก',
    'ส่วนสูง',
    'น้ำหนักตามเกณฑ์อายุ',
    'ส่วนสูงตามเกณฑ์อายุ',
    'น้ำหนักตามเกณฑ์ส่วนสูง',
  ];

  const renderIndicators = () =>
    Array(nutritionDates.length)
      .fill(0)
      .flatMap((_, i) =>
        indicatorLabels.map((text, index) => (
          <th
            key={`${text}-${i}-${index}`}
            rowSpan={2}
            className="h-32 border border-gray-300 p-1 text-center align-middle"
          >
            <div className="rotate-180 transform whitespace-nowrap [writing-mode:vertical-rl]">
              {text}
            </div>
          </th>
        )),
      );

  const totalIndicatorsPerStudent = nutritionDates.length * indicatorLabels.length;

  return (
    <div>
      <Content>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full table-fixed border-collapse border border-gray-300 text-sm">
            <thead>
              <tr>
                <th
                  colSpan={6 + totalIndicatorsPerStudent}
                  className="border border-gray-300 bg-gray-100 text-center align-middle text-base font-bold"
                >
                  ผลการประเมินภาวะโภชนาการ
                </th>
              </tr>

              <tr>
                <th
                  rowSpan={3}
                  colSpan={6}
                  className="border border-gray-300 text-center align-middle"
                >
                  ชื่อสกุล
                </th>
                <th
                  colSpan={totalIndicatorsPerStudent}
                  className="border border-gray-300 text-center align-middle"
                >
                  ผลการวัดตามช่วงเวลา
                </th>
              </tr>

              <tr>
                {nutritionDates.map((date, index) => (
                  <th
                    key={index}
                    colSpan={indicatorLabels.length}
                    className="border border-gray-300 text-center align-middle"
                  >
                    {dayjs(date).format('D MMMM YYYY')}
                  </th>
                ))}
              </tr>

              <tr>{renderIndicators()}</tr>
            </thead>

            <tbody>
              {nutritionalData.map((student) => (
                <tr key={student.evaluation_student_id}>
                  <td colSpan={6} className="border border-gray-300 px-2 text-left">
                    {`${student.additional_fields.title}${student.additional_fields.thai_first_name} ${student.additional_fields.thai_last_name}`}
                  </td>
                  {student.student_indicator_data.map((indicator, idx) => (
                    <td
                      key={idx}
                      className="border border-gray-300 text-center align-middle"
                    >
                      {indicator.value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Content>
    </div>
  );
};

export default DomainJSX;
