import {
  IGetPhorpor5Detail,
  NutritionDataItem,
} from '@domain/g06/g06-d05/local/api/type';
import { MonthData, StudentSummary } from '../class-time';
import dayjs from '@global/utils/dayjs';

export function getClassTimeInfo(ClassTimeData: IGetPhorpor5Detail[]): {
  students: StudentSummary[];
  monthLists: MonthData[];
} {
  if (!ClassTimeData || ClassTimeData.length === 0) {
    return {
      students: [],
      monthLists: [],
    };
  }

  const data = ClassTimeData[0];
  const nutritionData = data.data_json as unknown as NutritionDataItem[];
  const studentList = data.student_list || [];
  const startDate = dayjs(data.additional_data?.start_date);
  const endDate = dayjs(data.additional_data?.end_date);

  const getThaiMonthName = (monthNumber: number): string => {
    const monthNames = [
      'ม.ค.',
      'ก.พ.',
      'มี.ค.',
      'เม.ย.',
      'พ.ค.',
      'มิ.ย.',
      'ก.ค.',
      'ส.ค.',
      'ก.ย.',
      'ต.ค.',
      'พ.ย.',
      'ธ.ค.',
    ];
    return monthNames[monthNumber - 1] || '';
  };

  const monthLists: MonthData[] = [];
  let current = startDate.startOf('month');

  while (current.isBefore(endDate.endOf('month'))) {
    const monthNumber = current.month() + 1;
    monthLists.push({
      month: monthNumber,
      monthName: getThaiMonthName(monthNumber),
      year: current.year(),
      days: current.daysInMonth(),
    });
    current = current.add(1, 'month');
  }

  const students = studentList.map((student) => {
    const studentData = nutritionData.find(
      (item) => item.evaluation_student_id === student.id,
    );

    const attendanceRecords =
      studentData?.student_indicator_data?.map((indicator) => ({
        date: indicator.indicator_general_name,
        status: indicator.value,
      })) || [];

    // คำนวณสถิติรายเดือน
    const monthlyStats = monthLists.map((month) => {
      const monthRecords = attendanceRecords.filter((record) => {
        const recordDate = dayjs(record.date);
        return recordDate.month() + 1 === month.month && recordDate.year() === month.year;
      });

      return {
        month: month.month,
        present: monthRecords.filter((r) => r.status === 1).length,
        totalDays: month.days,
      };
    });

    // คำนวณสถิติทั้งหมด
    const totalPresent = attendanceRecords.filter((r) => r.status === 1).length;
    const totalDays = attendanceRecords.length || 1;
    const percentage = (totalPresent / totalDays) * 100;

    return {
      id: student.id,
      no: student.no,
      name: `${student.title} ${student.thai_first_name} ${student.thai_last_name}`,
      monthlyStats,
      totalStats: {
        present: totalPresent,
        totalDays: totalDays,
        percentage: percentage,
      },
    };
  });

  return {
    students,
    monthLists,
  };
}
