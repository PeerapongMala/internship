import React from 'react';
import {
  IGetSheetDetail,
  IStudentIndicatorDaum,
  IUpdateSheetRequest,
} from '@domain/g06/g06-d03/local/type';

const FIELD_LABELS = [
  'น้ำหนัก',
  'ส่วนสูง',
  'น้ำหนักตามเกณฑ์อายุ',
  'ส่วนสูงตามเกณฑ์อายุ',
  'น้ำหนักตามเกณฑ์ส่วนสูง',
];

type TableNutritionProps = {
  sheetDetail: IGetSheetDetail;
  studentScoreData: IUpdateSheetRequest;
  editMode: boolean;
  onInputScoreChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    indexJsonStudentScoreData: number,
    indexStudentIndicator: number,
    indicatorData: IStudentIndicatorDaum,
  ) => void;
};

// TODO: Enhance css
const TableNutrition: React.FC<TableNutritionProps> = ({
  studentScoreData,
  editMode,
  onInputScoreChange,
}) => {
  return (
    <table className="data-entry-table th-fixed border-collapse overflow-x-scroll border bg-white">
      <thead>
        <tr>
          <th colSpan={21} className="border text-center">
            ผลการประเมินภาวะโภชนาการ
          </th>
        </tr>
        <tr>
          <th className="th-fullname w-60" rowSpan={5}>
            ชื่อสกุล
          </th>
          <th colSpan={10}>ภาคเรียนที่ 1</th>
          <th colSpan={10}>ภาคเรียนที่ 2</th>
        </tr>
        <tr>
          <th colSpan={5}>ครั้งที่ 1</th>
          <th colSpan={5}>ครั้งที่ 2</th>
          <th colSpan={5}>ครั้งที่ 1</th>
          <th colSpan={5}>ครั้งที่ 2</th>
        </tr>
        <tr>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
        <tr>
          {Array.from({ length: 4 }).map((_, i) =>
            FIELD_LABELS.map((label, j) => (
              <th
                key={`header-${i}-${j}`}
                className="h-[160px] whitespace-nowrap text-center align-middle"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                {label}
              </th>
            )),
          )}
        </tr>
      </thead>
      <tbody>
        {studentScoreData.json_student_score_data?.map(
          (studentData, indexJsonStudentScoreData) => (
            <tr key={indexJsonStudentScoreData}>
              <td className="w-60 border">
                {studentData.student_detail?.title}{' '}
                {studentData.student_detail?.thai_first_name}{' '}
                {studentData.student_detail?.thai_last_name}
              </td>
              {studentData.student_indicator_data.map(
                (indicatorData, indexStudentIndicator) => (
                  <td
                    key={`input-${indexJsonStudentScoreData}-${indexStudentIndicator}`}
                    className="border px-1 py-0"
                  >
                    <input
                      type="text"
                      pattern="\d*"
                      inputMode="numeric"
                      className="w-full border-none text-center focus:outline-none"
                      disabled={!editMode}
                      value={indicatorData.value ?? ''}
                      onChange={(e) =>
                        onInputScoreChange(
                          e,
                          indexJsonStudentScoreData,
                          indexStudentIndicator,
                          indicatorData,
                        )
                      }
                    />
                  </td>
                ),
              )}
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
};

export default TableNutrition;
