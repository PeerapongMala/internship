import {
  IGetSheetDetail,
  IStudentIndicatorDaum,
  IUpdateSheetRequest,
} from '@domain/g06/g06-d03/local/type';
import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import dayjs from '@global/utils/dayjs';
import { getMonthDayCounts } from '@domain/g06/local/utils/date';
import 'dayjs/locale/th';
import showMessage from '@global/utils/showMessage';
import router from '@global/utils/router-global';
import { TPagination } from '@global/types/api';
import { ATTENDANCE_SCORE_LABEL } from '@domain/g06/local/constant/score';
import SumAttendanceData from './components/SumAttendanceData';

type AttendanceTableProps = {
  pagination: TPagination;
  setPagination: Dispatch<SetStateAction<TPagination>>;
  sheetDetail: IGetSheetDetail;
  studentScoreData: IUpdateSheetRequest;
  onInputScoreChange?: (
    e: string,
    indexJsonStudentScoreData: number,
    indexStudentIndicator: number,
    indicatorData: IStudentIndicatorDaum,
  ) => void;
  isEdit?: boolean;
};

// million-ignore
const AttendanceTable: React.FC<AttendanceTableProps> = ({
  pagination,
  setPagination,
  sheetDetail,
  studentScoreData,
  onInputScoreChange,
  isEdit,
}) => {
  if (
    sheetDetail?.sheet_data?.general_type !== 'เวลาเรียน' ||
    !sheetDetail.additional_data?.start_date ||
    !sheetDetail.additional_data?.end_date
  ) {
    return null;
  }

  const startDate = useMemo(() => {
    return dayjs(sheetDetail.additional_data?.start_date, 'YYYY-MM-DD');
  }, [sheetDetail.additional_data?.start_date]);

  const endDate = useMemo(() => {
    return dayjs(sheetDetail.additional_data?.end_date, 'YYYY-MM-DD');
  }, [sheetDetail.additional_data?.end_date]);

  const monthLists = useMemo(() => {
    if (startDate.isAfter(endDate)) {
      router.history.back();
      showMessage('วันเริ่มต้นของปีการศึกษาต้องมาก่อนวันสิ้นสุดของปีการศึกษา', 'warning');
      return;
    }

    return getMonthDayCounts(startDate, endDate);
  }, [startDate, endDate, router]);

  // const dayCount = useMemo(() => Math.abs(startDate.diff(endDate)), [startDate, endDate]);

  const currentMonth = useMemo(() => {
    if (!monthLists || monthLists.length === 0) return null;
    return monthLists[pagination.page - 1]; // แสดงเฉพาะเดือนนี้
  }, [monthLists, pagination.page]);

  const currentTableHeader = useMemo(() => {
    if (!currentMonth) return null;
    const year = sheetDetail.sheet_data?.year;
    const academicYear = sheetDetail.sheet_data?.academic_year;
    const date = dayjs(currentMonth.dateIso);
    return {
      header: `เวลาเรียน ชั้น ${year} ปีการศึกษา ${academicYear}`,
      subHeader: `${date.locale('th').format('เดือน MMMM พ.ศ. BBBB')}`,
      dayCount: dayjs(currentMonth.dateIso).daysInMonth(),
    };
  }, [currentMonth, sheetDetail]);

  useEffect(() => {
    if (monthLists?.length) {
      setPagination((prev) => ({
        ...prev,
        total_count: monthLists.length,
      }));
    }
  }, [monthLists]);

  return (
    <div className="relative max-h-[500px] w-full overflow-x-scroll">
      <table className="data-entry-table w-full table-fixed !border-separate !border-spacing-0 border border-gray-300">
        <thead>
          <tr>
            {currentTableHeader && (
              <th
                // +4 cause ม ป ล ส
                colSpan={2 + currentTableHeader.dayCount + 4}
                className="relative border text-center font-bold"
              >
                {currentTableHeader.header}
              </th>
            )}
          </tr>
          <tr>
            {currentTableHeader && (
              <th
                // +4 cause ม ป ล ส
                colSpan={2 + currentTableHeader.dayCount + 4}
                className="border text-center font-bold"
              >
                {currentTableHeader.subHeader}
              </th>
            )}
          </tr>
          <tr>
            <th className="sticky left-0 z-10 w-16 min-w-20 text-center font-bold">
              เลขที่
            </th>
            <th className="th-fullname sticky left-20 z-10 font-bold">ชื่อ - นามสกุล</th>

            {/* prefilled start */}
            {currentMonth &&
              dayjs(currentMonth.dateIso).isSame(startDate, 'year') &&
              dayjs(currentMonth.dateIso).isSame(startDate, 'month') &&
              [
                ...Array.from({
                  length: startDate.date() - dayjs(currentMonth.dateIso).date(),
                }),
              ].map((_, i) => <th key={`prefilled-start-${i + 1}`}>{i + 1}</th>)}
            {currentMonth &&
              [...Array(currentMonth.days)].map((_, i) => {
                const date = dayjs(currentMonth.dateIso).startOf('month').add(i, 'day');

                let day = date.date();
                if (
                  date.month() == startDate.month() &&
                  date.year() == startDate.year()
                ) {
                  day = i + startDate.date();
                }

                return <th key={`day-${i}`}>{day}</th>;
              })}
            {/* prefilled end */}
            {currentMonth &&
              dayjs(currentMonth.dateIso).isSame(endDate, 'year') &&
              dayjs(currentMonth.dateIso).isSame(endDate, 'month') &&
              [
                ...Array.from({
                  length: dayjs(currentMonth?.dateIso).daysInMonth() - endDate.date(),
                }),
              ].map((_, i) => {
                return <th key={`prefill-end-${i}`}>{endDate.date() + i + 1}</th>;
              })}

            <th>ม</th>
            <th>ป</th>
            <th>ล</th>
            <th>ข</th>
          </tr>
        </thead>

        <tbody>
          {studentScoreData.json_student_score_data.map((scoreData, rowIndex) => (
            <tr key={`student-${rowIndex}`} className="odd:bg-gray-100">
              <td className="sticky left-0 z-10 py-2 text-center">{rowIndex + 1}</td>
              <td className="sticky left-20 z-10 border px-4 py-2">
                {`${scoreData.student_detail?.thai_first_name} ${scoreData.student_detail?.thai_last_name}`}
              </td>

              {/* Prefill Start */}
              {currentMonth &&
                dayjs(currentMonth.dateIso).isSame(startDate, 'year') &&
                dayjs(currentMonth.dateIso).isSame(startDate, 'month') &&
                [
                  ...Array.from({
                    length: startDate.date() - dayjs(currentMonth.dateIso).date(),
                  }),
                ].map((_, i) => (
                  <td key={`prefill-start-${rowIndex}-${i}`} className="text-center">
                    <input disabled value="-" />
                  </td>
                ))}

              {currentMonth &&
                [...Array(currentMonth.days)].map((_, colIndex) => {
                  const col =
                    colIndex +
                    (pagination.page == 1
                      ? 0
                      : dayjs(currentMonth.dateIso).diff(startDate, 'day'));
                  const data = scoreData.student_indicator_data?.[col];
                  return (
                    <td key={`student${rowIndex}-col-${colIndex}`} className="">
                      <input
                        disabled={isEdit}
                        value={ATTENDANCE_SCORE_LABEL[data.value] ?? ''}
                        onChange={(e) => {
                          let text = e.target.value;

                          if (e.target.value.length > 1) {
                            text = text.slice(-1);
                          }

                          onInputScoreChange?.(text, rowIndex, col, data);
                        }}
                        className={` ${ATTENDANCE_SCORE_LABEL['4'] == ATTENDANCE_SCORE_LABEL[data.value] ? 'text-red-500' : ''} `}
                        type="text"
                      />
                    </td>
                  );
                })}

              {/* Prefill End */}
              {currentMonth &&
                dayjs(currentMonth.dateIso).isSame(endDate, 'year') &&
                dayjs(currentMonth.dateIso).isSame(endDate, 'month') &&
                [
                  ...Array.from({
                    length: dayjs(currentMonth.dateIso).daysInMonth() - endDate.date(),
                  }),
                ].map((_, i) => (
                  <td key={`prefill-end-${rowIndex}-${i}`} className="text-center">
                    {/* will use normal text when find way to fix width */}
                    <input disabled value="-" />
                  </td>
                ))}

              {/* return 4 td to show sum of ม ป ล ข */}
              {/* sum of input each student */}
              <SumAttendanceData data={scoreData.student_indicator_data} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
