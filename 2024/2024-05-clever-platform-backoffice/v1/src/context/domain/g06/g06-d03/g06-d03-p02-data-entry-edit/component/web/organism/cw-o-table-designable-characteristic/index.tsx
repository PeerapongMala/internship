import React, { useMemo } from 'react';
import {
  IGetSheetDetail,
  IStudentIndicatorDaum,
  IUpdateSheetRequest,
} from '@domain/g06/g06-d03/local/type';
import showMessage from '@global/utils/showMessage';
import { calculateMode } from '@global/utils/calculateMode';


type DesirableCharacteristicsTableProps = {
  sheetDetail: IGetSheetDetail;
  studentScoreData: IUpdateSheetRequest;
  editMode: boolean;
  onInputScoreChange: (updatedData: IUpdateSheetRequest) => void;
};

const DesirableCharacteristicsTable: React.FC<DesirableCharacteristicsTableProps> = ({
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
    const student = jsonStudentData[studentIndex];

    student.student_indicator_data[indicatorIndex].value = value;

    // คำนวณ คุณลักษณะ (index 0-6) → เก็บที่ index 8 
    const desirableScores = student.student_indicator_data
      .slice(0, 7)
      .map(indicator => indicator.value);
    const desirableMode = calculateMode(desirableScores);
    const desirableResult = desirableMode + 1;
    student.student_indicator_data[8].value = desirableResult;

    //คำนวณ การอ่านฯ (index 9-13) → เก็บที่ index 14 
    const readingScores = student.student_indicator_data
      .slice(9, 14)
      .map(indicator => indicator.value);
    const readingMode = calculateMode(readingScores);
    const readingResult = readingMode + 1;
    student.student_indicator_data[14].value = readingResult;


    updatedData.json_student_score_data = jsonStudentData;

    onInputScoreChange(updatedData);
  };

  return (
    <table className="data-entry-table w-max table-fixed border-collapse border bg-white">
      <thead>
        <tr>
          <th colSpan={23} className="border text-center">
            สรุปประเมินคุณลักษณะอันพึงประสงค์ - การอ่าน คิดวิเคราะห์ และเขียนสื่อความ ชั้น
            {year} ปีการศึกษา {academicYear}
          </th>
        </tr>
        <tr>
          <th rowSpan={3} className="th-fullname whitespace-nowrap border text-center">
            ชื่อสกุล
          </th>
          <th rowSpan={3} className="text-nowrap border text-center">
            เลขที่
          </th>
          <th colSpan={12} className="border text-center">
            คุณลักษณะอันพึงประสงค์
          </th>
          <th colSpan={9} className="border text-center">
            อ่าน คิดวิเคราะห์ และเขียนสื่อความ
          </th>
        </tr>
        <tr>
          <th className="border" rowSpan={2}>
            <span className="inline-flex min-h-[110px] rotate-180 items-center [writing-mode:vertical-rl]">
              รักชาติ
            </span>
          </th>
          <th className="border" rowSpan={2}>
            <span className="inline-flex min-h-[110px] rotate-180 items-center [writing-mode:vertical-rl]">
              ซื่อสัตย์
            </span>
          </th>
          <th className="border" rowSpan={2}>
            <span className="inline-flex min-h-[110px] rotate-180 items-center [writing-mode:vertical-rl]">
              มีวินัย
            </span>
          </th>
          <th className="border" rowSpan={2}>
            <span className="inline-flex min-h-[110px] rotate-180 items-center [writing-mode:vertical-rl]">
              ใฝ่เรียนรู้
            </span>
          </th>
          <th className="border" rowSpan={2}>
            <span className="inline-flex min-h-[110px] rotate-180 items-center [writing-mode:vertical-rl]">
              พอเพียง
            </span>
          </th>
          <th className="border" rowSpan={2}>
            <span className="inline-flex min-h-[110px] rotate-180 items-center [writing-mode:vertical-rl]">
              มุ่งมั่น
            </span>
          </th>
          <th className="border" rowSpan={2}>
            <span className="inline-flex min-h-[110px] rotate-180 items-center [writing-mode:vertical-rl]">
              เป็นไทย
            </span>
          </th>
          <th className="" rowSpan={2}>
            <span className="inline-flex min-h-[110px] rotate-180 items-center [writing-mode:vertical-rl]">
              สาธารณะ
            </span>
          </th>

          <th className="text-center" colSpan={4}>
            ผลการประเมิน
          </th>

          <th className="border" rowSpan={2}>
            1
          </th>
          <th className="border" rowSpan={2}>
            2
          </th>
          <th className="border" rowSpan={2}>
            3
          </th>
          <th className="border" rowSpan={2}>
            4
          </th>
          <th className="border" rowSpan={2}>
            5
          </th>

          <th className="text-center" colSpan={4}>
            ผลการประเมิน
          </th>
        </tr>
        <tr>
          <th className="!w-[40px] text-nowrap border">ไม่ผ่าน</th>
          <th className="!w-[40px] text-nowrap border">ผ่าน</th>
          <th className="!w-[40px] text-nowrap border">ดี</th>
          <th className="!w-[40px] text-nowrap border">ดีเยี่ยม</th>
          <th className="!w-[40px] text-nowrap border">ไม่ผ่าน</th>
          <th className="!w-[40px] text-nowrap border">ผ่าน</th>
          <th className="!w-[40px] text-nowrap border">ดี</th>
          <th className="!w-[40px] text-nowrap border">ดีเยี่ยม</th>
        </tr>
      </thead>
      <tbody>
        {studentScoreData.json_student_score_data?.map(
          (studentData, studentIndex) => (
            <tr key={studentIndex}>
              <td className="text-nowrap border">
                {studentData.student_detail?.title}{' '}
                {studentData.student_detail?.thai_first_name}{' '}
                {studentData.student_detail?.thai_last_name}
              </td>
              <td className="border text-center">{studentData.student_detail?.no}</td>

              {studentData.student_indicator_data.map(
                (indicatorData, indicatorIndex) => {
                  //  ผลการประเมินรวมของ "คุณลักษณะ" (index 8)
                  if (indicatorIndex === 8) {
                    const result = indicatorData.value || 1; // 1=ไม่ผ่าน, 2=ผ่าน, 3=ดี, 4=ดีเยี่ยม
                    return (
                      <React.Fragment key={`desirable-result-${studentIndex}`}>
                        {[1, 2, 3, 4].map((level) => (
                          <td
                            key={`checkbox-${level}`}
                            className="td-fixed  border py-0 text-center cursor-not-allowed  w-14"
                          >
                            {editMode ? (
                              <div className="flex justify-center items-center cursor-not-allowed opacity-70">
                                {result === level ? "✓" : ""}
                              </div>
                            ) : (
                              <div>{result === level ? "✓" : ""}</div>
                            )}
                          </td>
                        ))}
                      </React.Fragment>
                    );
                  }

                  //  คะแนนการอ่านฯ (index 9-13) 
                  if (indicatorIndex >= 9 && indicatorIndex <= 13) {
                    return (
                      <td
                        key={indicatorIndex}
                        className="td-fixed cursor-pointer border py-0"
                      >
                        <input
                          type="text"
                          className="block h-full w-full text-center focus:outline-none co"
                          disabled={!editMode}
                          value={indicatorData.value}
                          onChange={(e) => handleScoreChange(e, studentIndex, indicatorIndex)}
                        />
                      </td>
                    );
                  }

                  //  ผลการประเมินรวมของ "การอ่านฯ" (index 14) 
                  if (indicatorIndex === 14) {
                    const result = indicatorData.value || 1;
                    return (
                      <React.Fragment key={`reading-result-${studentIndex}`}>
                        {[1, 2, 3, 4].map((level) => (
                          <td
                            key={`checkbox-${level}`}
                            className="td-fixed  border py-0 text-center cursor-not-allowed  w-14"
                          >
                            {editMode ? (
                              <div className="flex justify-center items-center cursor-not-allowed opacity-70">
                                {result === level ? "✓" : ""}
                              </div>
                            ) : (
                              <div>{result === level ? "✓" : ""}</div>
                            )}
                          </td>
                        ))}
                      </React.Fragment>
                    );
                  }

                  // คุณลักษณะอันพึงประสงค์ (index 0-6) และ index 7 
                  return (
                    <td
                      key={indicatorIndex}
                      className="td-fixed cursor-pointer border py-0"
                    >
                      <input
                        type="text"
                        className="block h-full w-full text-center focus:outline-none"
                        disabled={!editMode}
                        value={indicatorData.value}
                        onChange={(e) => handleScoreChange(e, studentIndex, indicatorIndex)}
                      />
                    </td>
                  );
                }
              )}
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default DesirableCharacteristicsTable;