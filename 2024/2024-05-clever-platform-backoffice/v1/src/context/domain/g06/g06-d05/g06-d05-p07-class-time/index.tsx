import { useEffect, useState } from 'react';
import styles from './index.module.css';
import API from '../local/api';
import Content from '../local/component/web/atom/Content';
import { useParams } from '@tanstack/react-router';
import { IGetPhorpor5Detail, NutritionDataItem } from '../local/api/type';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import {
  getAttendanceStatusClass,
  getAttendanceStatusText,
} from '@global/utils/attendanceStatus';
import StoreGlobalPersist from '@store/global/persist';

interface ClassTimeStudent {
  id: number;
  no: number;
  name: string;
  attendance_records: {
    date: string;
    status: number;
  }[];
}

interface ClassTimeData {
  month: number;
  year: number;
  students: ClassTimeStudent[];
  total_days: number;
}

interface MonthData {
  month: number;
  year: number;
  days: number;
}
interface AttendanceSummary {
  present: number;
  sick: number;
  leave: number;
  absent: number;
  total: number;
}
const DomainJSX = () => {
  const { evaluationForm }: { evaluationForm: TEvaluationForm } =
    StoreGlobalPersist.StateGet(['evaluationForm']);
  const [classTimeData, setClassTimeData] = useState<ClassTimeData>({
    month: 0,
    students: [],
    total_days: 0,
    year: 0,
  });

  const [monthLists, setMonthLists] = useState<MonthData[]>([]);
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs());
  const [summaryData, setSummaryData] = useState<AttendanceSummary[]>([]);
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
      const response = await API.GetDetailPhorpor5(evaluationFormId, path, {});

      if (response?.status_code === 200 && response.data && response.data.length > 0) {
        const data = response.data[0];
        console.log({ data: data });
        if (!data.student_list) {
          console.error('student_list is undefined');
          return;
        }
        console.log(data);

        const start = dayjs(data.additional_data?.start_date);
        const end = dayjs(data.additional_data?.end_date);
        setStartDate(start);
        setEndDate(end);

        // สร้างรายการเดือน
        const months: MonthData[] = [];
        let current = start.startOf('month');

        while (current.isBefore(end.endOf('month'))) {
          const daysInMonth = current.daysInMonth();
          months.push({
            month: current.month() + 1,
            year: current.year(),
            days: daysInMonth,
          });
          current = current.add(1, 'month');
        }
        setMonthLists(months);

        const nutritionData = data.data_json as unknown as NutritionDataItem[];

        const students: ClassTimeStudent[] = data.student_list.map((student) => {
          const studentData = nutritionData.find(
            (item) => item.evaluation_student_id === student.id,
          );

          return {
            id: student.id,
            no: student.no,
            name: `${student.title} ${student.thai_first_name} ${student.thai_last_name}`,
            attendance_records:
              studentData?.student_indicator_data?.map((indicator) => ({
                date: indicator.indicator_general_name,
                status: indicator.value,
              })) || [],
          };
        });
        const summaries = students.map((student) => {
          const summary = {
            present: 0,
            sick: 0,
            leave: 0,
            absent: 0,
            total: student.attendance_records.length,
          };

          student.attendance_records.forEach((record) => {
            switch (record.status) {
              case 1:
                summary.present++;
                break;
              case 2:
                summary.sick++;
                break;
              case 3:
                summary.leave++;
                break;
              case 4:
                summary.absent++;
                break;
            }
          });

          return summary;
        });

        setSummaryData(summaries);

        const total_days = months.reduce((sum, month) => sum + month.days, 0);

        const classTimeData: ClassTimeData = {
          month: start.month() + 1,
          year: start.year(),
          students,
          total_days,
        };

        setClassTimeData(classTimeData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <div>
      <Content>
        <div className="relative max-h-[500px] w-full overflow-x-auto shadow-sm">
          <table
            className={`${styles.table} w-full !border-separate !border-spacing-0 border border-gray-300`}
          >
            <colgroup className="border">
              <col className="w-[64px]" />
              <col className="w-[192px]" />
              {monthLists.flatMap((month) =>
                [...Array(month.days)].map((_, i) => (
                  <col key={`col-${month.month}-${i}`} className="w-[40px]" />
                )),
              )}
              <col className="w-[40px]" />
              <col className="w-[40px]" />
              <col className="w-[40px]" />
              <col className="w-[40px]" />
            </colgroup>

            <thead className="sticky top-0 z-10 border bg-gray-50">
              {/* เลขที่ */}
              <tr>
                <th
                  rowSpan={3}
                  className="sticky left-0 z-20 border border-gray-300 bg-white p-2 text-center text-sm"
                >
                  เลขที่
                </th>

                {/*  ชื่อ - นามสกุล */}
                <th
                  rowSpan={3}
                  className="sticky left-[64px] z-20 border-y border-gray-300 bg-white p-2 text-left text-sm"
                >
                  ชื่อ - นามสกุล
                </th>

                {monthLists.map((month, i) => (
                  <th
                    key={`month-header-${i}`}
                    className="border-b border-gray-300 p-2 text-center font-semibold text-gray-700"
                    colSpan={month.days}
                  >
                    {/* เวลาเรียน ชั้นประถมศึกษาปีที่ 1 ปีการศึกษา {month.year + 543} */}
                    {`เวลาเรียน ${evaluationForm?.year} ปีการศึกษา `}
                    {evaluationForm?.academic_year}
                  </th>
                ))}
              </tr>

              {/* แถวเดือน */}
              <tr>
                {monthLists.map((month, i) => (
                  <th
                    key={`month-subheader-${i}`}
                    className="border-b border-gray-300 p-2 text-center font-medium text-gray-600"
                    colSpan={month.days}
                  >
                    {dayjs()
                      .month(month.month - 1)
                      .locale('th')
                      .format('MMMM')}{' '}
                    พ.ศ.{month.year + 543}
                  </th>
                ))}
              </tr>

              {/* แถววันที่ */}
              <tr>
                {monthLists.map((month, monthIndex) =>
                  [...Array(month.days)].map((_, dayIndex) => {
                    const dayNumber = dayIndex + 1;
                    return (
                      <th
                        key={`day-${monthIndex}-${dayIndex}`}
                        className="border-b border-gray-300 p-1 text-center text-xs font-medium text-gray-600"
                      >
                        {dayNumber}
                      </th>
                    );
                  }),
                )}
                <th className="sticky border-b border-gray-300 p-1 text-center text-xs font-medium text-gray-600">
                  ม
                </th>
                <th className="sticky border-b border-gray-300 p-1 text-center text-xs font-medium text-gray-600">
                  ป
                </th>
                <th className="sticky border-b border-gray-300 p-1 text-center text-xs font-medium text-gray-600">
                  ล
                </th>
                <th className="sticky border-b border-gray-300 p-1 text-center text-xs font-medium text-gray-600">
                  ข
                </th>
              </tr>
            </thead>

            <tbody className="divide divide-y border bg-white">
              {classTimeData.students.map((student, rowIndex) => {
                const studentSummary = summaryData[rowIndex] || {
                  present: 0,
                  sick: 0,
                  leave: 0,
                  absent: 0,
                };

                return (
                  <tr key={`student-${rowIndex}`} className="hover:bg-gray-50">
                    <td className="sticky left-0 z-10 border border-gray-300 bg-white p-2 text-center text-sm">
                      {student.no}
                    </td>
                    <td className="sticky left-[64px] z-10 border border-gray-300 bg-white p-2 text-sm">
                      {student.name}
                    </td>

                    {monthLists.flatMap((month) =>
                      [...Array(month.days)].map((_, dayIndex) => {
                        const recordIndex =
                          monthLists
                            .slice(0, monthLists.indexOf(month))
                            .reduce((sum, m) => sum + m.days, 0) + dayIndex;
                        const record = student.attendance_records[recordIndex] || {
                          status: 0,
                        };

                        return (
                          <td
                            key={`attendance-${rowIndex}-${recordIndex}`}
                            className="p-1 text-center text-sm"
                          >
                            <span
                              className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${getAttendanceStatusClass(record.status)}`}
                            >
                              {getAttendanceStatusText(record.status)}
                            </span>
                          </td>
                        );
                      }),
                    )}

                    {/* Summary cells - sticky on right side */}
                    <td className="border border-gray-300 bg-white p-1 text-center text-sm">
                      {studentSummary.present}
                    </td>
                    <td className="border border-gray-300 bg-white p-1 text-center text-sm">
                      {studentSummary.sick}
                    </td>
                    <td className="border border-gray-300 bg-white p-1 text-center text-sm">
                      {studentSummary.leave}
                    </td>
                    <td className="border border-gray-300 bg-white p-1 text-center text-sm">
                      {studentSummary.absent}
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
