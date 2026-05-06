import React, { useMemo } from 'react';
import {
  IGetSheetDetail,
  IStudentIndicatorDaum,
  IUpdateSheetRequest,
} from '@domain/g06/g06-d03/local/type';
import showMessage from '@global/utils/showMessage';
import { calculateMode } from '@global/utils/calculateMode';


type CompetenciesTableProps = {
  sheetDetail: IGetSheetDetail;
  studentScoreData: IUpdateSheetRequest;
  editMode: boolean;
  onInputScoreChange: (updatedData: IUpdateSheetRequest) => void;
};

const CompetenciesTable: React.FC<CompetenciesTableProps> = ({
  sheetDetail,
  studentScoreData,
  editMode,
  onInputScoreChange,
}) => {
  const year = useMemo(() => {
    return sheetDetail.sheet_data?.year ?? '-';
  }, [sheetDetail.sheet_data?.year]);

  const academicYear = useMemo(() => {
    return sheetDetail.sheet_data?.academic_year ?? '-';
  }, [sheetDetail.sheet_data?.academic_year]);

  const handleScoreChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    studentIndex: number,
    indicatorIndex: number
  ) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      value = 0;
      showMessage('กรุณากรอกตัวเลข', 'warning');
    } else if (value > 3) {
      value = 3;
      showMessage('คะแนนสูงสุดคือ 3', 'warning');
    } else if (value < 0) {
      value = 0;
      showMessage('คะแนนต้องไม่น้อยกว่า 0', 'warning');
    }
    const updatedData = { ...studentScoreData };
    const jsonStudentData = [...updatedData.json_student_score_data];

    jsonStudentData[studentIndex].student_indicator_data[indicatorIndex].value = value;

    const scores = jsonStudentData[studentIndex].student_indicator_data
      .slice(0, 5)
      .map(indicator => indicator.value);

    const mode = calculateMode(scores);
    const finalLevel = mode + 1;

    jsonStudentData[studentIndex].student_indicator_data[5].value = finalLevel;

    updatedData.json_student_score_data = jsonStudentData;

    onInputScoreChange(updatedData);
  };

  return (
    <table className="data-entry-table w-max table-fixed border-collapse border">
      <thead className="table-fixed whitespace-nowrap border text-center">
        <tr>
          <th colSpan={11} className="border text-center">
            สรุปการประเมินสมรรถนะสำคัญของผู้เรียน - ชั้น{year} ปีการศึกษา {academicYear}
          </th>
        </tr>
        <tr>
          <th rowSpan={3} className="th-fullname border text-center align-bottom">
            ชื่อ-สกุล
          </th>
          <th rowSpan={3} className="border text-center">
            เลขที่
          </th>
          <th colSpan={9} className="border text-center">
            สมรรถนะสำคัญของผู้เรียน
          </th>
        </tr>
        <tr>
          <th className="border text-center" rowSpan={2}>
            1
          </th>
          <th className="border text-center" rowSpan={2}>
            2
          </th>
          <th className="border text-center" rowSpan={2}>
            3
          </th>
          <th className="border text-center" rowSpan={2}>
            4
          </th>
          <th className="border text-center" rowSpan={2}>
            5
          </th>
          <th className="border text-center" colSpan={4}>
            ผลการประเมิน
          </th>
        </tr>
        <tr>
          <th className="border text-center">ไม่ผ่าน</th>
          <th className="border text-center">ผ่าน</th>
          <th className="border text-center">ดี</th>
          <th className="border text-center">ดีเยี่ยม</th>
        </tr>
      </thead>
      <tbody>
        {studentScoreData.json_student_score_data?.map(
          (studentData, studentIndex) => {
            // ดึงค่าจาก competency-6 (index 5) 1=ไม่ผ่าน, 2=ผ่าน, 3=ดี, 4=ดีเยี่ยม
            const displayResult = studentData.student_indicator_data[5]?.value || 1;

            return (
              <tr key={studentIndex}>
                <td className="text-nowrap border">
                  <p className="ml-2">
                    {studentData.student_detail?.title}
                    {studentData.student_detail?.thai_first_name}{' '}
                    {studentData.student_detail?.thai_last_name}
                  </p>
                </td>
                <td className="border text-center">{studentData.student_detail?.no}</td>

                {studentData.student_indicator_data.slice(0, 5).map(
                  (indicatorData, indicatorIndex) => (
                    <td
                      key={`input-${indicatorIndex}`}
                      className="td-fixed border py-0 text-center"
                    >
                      <input
                        min={0}
                        max={3}
                        inputMode="numeric"
                        className="w-full text-center focus:outline-none"
                        disabled={!editMode}
                        value={indicatorData.value}
                        onChange={(e) =>
                          handleScoreChange(e, studentIndex, indicatorIndex)
                        }
                      />
                    </td>
                  )
                )}

                {/* แสดงผลการประเมิน */}
                {[1, 2, 3, 4].map((level) => (
                  <td key={level} className="text-center border w-12">
                    {editMode ? (
                      <div className="flex justify-center items-center cursor-not-allowed opacity-70">
                        {displayResult === level ? "✓" : ""}
                      </div>
                    ) : (
                      <div>{displayResult === level ? "✓" : ""}</div>
                    )}
                  </td>
                ))}
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );
};

export default CompetenciesTable;