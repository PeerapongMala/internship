import { IStudentIndicatorDaum } from '@domain/g06/g06-d03/local/type';
import { ATTENDANCE_SCORE_VALUE } from '@domain/g06/local/constant/score';
import { useMemo } from 'react';

type SumAttendanceDataProps = {
  data: IStudentIndicatorDaum[];
};

// million-ignore
const SumAttendanceData = ({ data }: SumAttendanceDataProps) => {
  const { come, sick, absence, missing } = useMemo(() => {
    let come = 0;
    let sick = 0;
    let absence = 0;
    let missing = 0;

    for (const entry of data) {
      switch (entry.value) {
        case ATTENDANCE_SCORE_VALUE['ม']:
          come += 1;
          break;
        case ATTENDANCE_SCORE_VALUE['ป']:
          sick += 1;
          break;
        case ATTENDANCE_SCORE_VALUE['ล']:
          absence += 1;
          break;
        case ATTENDANCE_SCORE_VALUE['ข']:
          missing += 1;
          break;
      }
    }

    return { come, sick, absence, missing };
  }, [data]);

  return (
    <>
      <td className="text-center">
        <input readOnly disabled value={come} />
      </td>
      <td className="text-center">
        <input readOnly disabled value={sick} />
      </td>
      <td className="text-center">
        <input readOnly disabled value={absence} />
      </td>
      <td className="text-center">
        <input readOnly disabled value={missing} />
      </td>
    </>
  );
};

export default SumAttendanceData;
