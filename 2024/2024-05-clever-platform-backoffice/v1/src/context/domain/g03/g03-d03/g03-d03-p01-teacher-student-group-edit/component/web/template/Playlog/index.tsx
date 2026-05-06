import CwProgress from '@component/web/cw-progress';
import CWProgressBar from '@component/web/cw-progress-bar';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import API from '@domain/g03/g03-d03/local/api';
import API0301 from '@domain/g03/g03-d01/local/api';
import { StudentGroupInfo } from '@domain/g03/g03-d03/local/api/group/student-group-info/type';
import { StudentGroupPlayLogFilterQueryParams } from '@domain/g03/g03-d03/local/api/repository/student-group-play-log';
import { StudentGroupPlayLog } from '@domain/g03/g03-d03/local/type';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import { toDateTimeTH } from '@global/utils/date';
import downloadCSV from '@global/utils/downloadCSV';
import { formatTimeString } from '@global/utils/format/time';
import { roundNumber } from '@global/utils/number';
import showMessage from '@global/utils/showMessage';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const TeacherStudentGroupPlayLog = function () {
  const navigate = useNavigate();
  const { studentGroupId } = useParams({ strict: false });

  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<Partial<StudentGroupPlayLogFilterQueryParams>>(
    {},
  );
  const [records, setRecords] = useState<StudentGroupPlayLog[]>([]);
  const [academicYears, setAcademicYears] = useState<
    {
      academic_year: number;
      start_date: string;
      end_date: string;
    }[]
  >([]);
  const [studentGroup, setStudentGroup] = useState<StudentGroupInfo>();

  useEffect(() => {
    API0301.dashboard.GetA01({ limit: -1 }).then((res) => {
      if (res.status_code === 200) {
        setAcademicYears(res.data);
        const currentYear = new Date().getFullYear() + 543;
        const currentAcademicYear = res.data.find(
          (year) => year.academic_year === currentYear,
        );

        if (currentAcademicYear) {
          setFilters((prev) => ({
            ...prev,
            academic_year: String(currentAcademicYear.academic_year),
            start_date: toDateEN(new Date(currentAcademicYear.start_date)),
            end_date: toDateEN(new Date(currentAcademicYear.end_date)),
          }));
        }
      }
    });

    API.studentGroupInfo.GetStudyGroupById(+studentGroupId).then((res) => {
      if (res.status_code === 200) {
        let data: StudentGroupInfo = res.data;
        if (Array.isArray(data)) {
          data = data[0];
        }
        setStudentGroup(data);
      }
    });
  }, [studentGroupId]);

  useEffect(() => {
    API.studentGroupPlayLog
      .Get(+studentGroupId, {
        ...filters,
        academic_year: filters?.academic_year || '',
        search: searchText,
      })
      .then((res) => {
        if (res.status_code === 200) {
          setRecords(res.data);
        } else {
          showMessage(res.message, 'error');
        }
      });
  }, [studentGroupId, filters, searchText]);

  function onDownload(data: { start_date: string; end_date: string }) {
    if (filters?.academic_year) {
      API.studentGroupPlayLog
        .DownloadCSV(+studentGroupId, {
          academic_year: filters.academic_year,
          start_date: data.start_date,
          end_date: data.end_date,
        })
        .then((res) => {
          if (res instanceof Blob) {
            downloadCSV(res, 'student-group-play-log.csv');
          } else {
            showMessage(res.message, 'error');
          }
        });
    } else {
      showMessage('กรุณาเลือกปีการศึกษาก่อน', 'warning');
    }
  }

  function toDateEN(date: Date) {
    return (
      date
        ?.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        .split('/')
        .reverse()
        .join('-') || ''
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-[#F5F5F5] p-5 shadow-sm">
        <h1 className="text-2xl font-bold">{studentGroup?.name}</h1>
        <h2>
          ปีการศึกษา: {studentGroup?.class_academic_year} / {studentGroup?.subject_name} /{' '}
          {studentGroup?.class_year} / ห้อง {studentGroup?.class_name}
        </h2>
      </div>

      <CWTableTemplate
        header={{
          showBulkEditButton: false,
          showUploadButton: false,
          onDownload(data) {
            onDownload({
              start_date: data.dateFrom,
              end_date: data.dateTo,
            });
          },
          onSearchChange(e) {
            setSearchText(e.currentTarget.value);
          },
        }}
        filters={[
          {
            key: 'academic_year',
            options: academicYears.map((year, i) => {
              const currentDate = new Date();
              let label = year.academic_year.toString();
              if (currentDate.getFullYear() + 543 === year.academic_year) {
                label = `ข้อมูลปีปัจจุบัน (${year.academic_year})`;
              }
              return { label, value: i };
            }),
            value: academicYears.findIndex(
              (aYear) => String(aYear.academic_year) === filters?.academic_year,
            ),
            onChange(index: number) {
              const value = academicYears[index];
              setFilters((prev) => ({
                ...prev,
                academic_year: String(value?.academic_year),
                start_date: value?.start_date
                  ? toDateEN(new Date(value?.start_date))
                  : undefined,
                end_date: value?.end_date
                  ? toDateEN(new Date(value?.end_date))
                  : undefined,
              }));
            },
          },
          {
            key: 'academic_year_range',
            type: 'date-range',
            value: [filters?.start_date, filters?.end_date],
            onChange(value) {
              setFilters((prev) => ({
                ...prev,
                academic_year: undefined,
                start_date: toDateEN(value[0]),
                end_date: toDateEN(value[1]),
              }));
            },
          },
        ]}
        table={
          records.length > 0
            ? {
                minHeight: 400,
                records,
                columns: [
                  {
                    accessor: 'seeBtn',
                    title: 'ดูข้อมูล',
                    width: 80,
                    titleClassName: 'text-center',
                    cellsClassName: 'text-center',
                    render: ({ user_id }) => (
                      <button
                        onClick={() => {
                          navigate({
                            to: `/teacher/student/student-info/${user_id}/history/${studentGroup?.class_name}/${studentGroup?.class_academic_year}`,
                          });
                        }}
                      >
                        <IconEye />
                      </button>
                    ),
                  },
                  {
                    accessor: '#',
                    title: '#',
                    render: (_, index) => index + 1,
                  },
                  {
                    accessor: 'student_id',
                    title: 'รหัสนักเรียน',
                  },
                  {
                    accessor: 'student_title',
                    title: 'คำนำหน้า',
                  },
                  {
                    accessor: 'student_first_name',
                    title: 'ชื่อ',
                  },
                  {
                    accessor: 'student_last_name',
                    title: 'สกุล',
                  },
                  {
                    accessor: 'pass_section',
                    title: 'ด่านที่ผ่าน (ด่าน)',
                    titleClassName: 'text-right',
                    render: (record) => (
                      <div className="flex flex-col">
                        <span className="text-right">
                          {record.total_passed_level.value}/
                          {record.total_passed_level.total}
                        </span>
                        <div className="ml-auto w-16">
                          <CWProgressBar
                            score={record.total_passed_level.value}
                            total={record.total_passed_level.total}
                          />
                        </div>
                      </div>
                    ),
                  },
                  {
                    accessor: 'pass_score',
                    title: 'คะเเนนรวม (คะแนน)',
                    titleClassName: 'text-right',
                    render: (record) => (
                      <div className="flex flex-col p-2">
                        <span className="text-right">
                          {record.total_score.value}/{record.total_score.total}
                        </span>
                        <div className="ml-auto w-16">
                          <CwProgress
                            percent={record.total_score.value / record.total_score.total}
                          />
                        </div>
                      </div>
                    ),
                  },
                  {
                    accessor: 'total_attempt',
                    title: 'ทำข้อสอบ (ครั้ง)',
                    titleClassName: 'text-right',
                    cellsClassName: 'text-right',
                    render: (record) => roundNumber(record.total_attempt),
                  },
                  {
                    accessor: 'average_time_used',
                    title: 'เวลาเฉลี่ย/ข้อ',
                    titleClassName: 'text-right',
                    cellsClassName: 'text-right',
                    render: (record) => formatTimeString(record.average_time_used),
                  },
                  {
                    accessor: 'lastest_login_at',
                    title: 'เข้าสู่ระบบล่าสุด',
                    render: (record) =>
                      record.lastest_login_at
                        ? toDateTimeTH(record.lastest_login_at)
                        : '',
                  },
                ],
              }
            : {
                minHeight: 400,
                records: [],
                columns: [
                  { accessor: '#', title: '#' },
                  { accessor: 'student_id', title: 'รหัสนักเรียน' },
                  { accessor: 'student_title', title: 'คำนำหน้า' },
                  { accessor: 'student_first_name', title: 'ชื่อ' },
                  { accessor: 'student_last_name', title: 'สกุล' },
                  { accessor: 'pass_section', title: 'ด่านที่ผ่าน (ด่าน)' },
                  { accessor: 'pass_score', title: 'คะเเนนรวม (คะแนน)' },
                  { accessor: 'total_attempt', title: 'ทำข้อสอบ (ครั้ง)' },
                  { accessor: 'average_time_used', title: 'เวลาเฉลี่ย/ข้อ' },
                  { accessor: 'lastest_login_at', title: 'เข้าสู่ระบบล่าสุด' },
                  { accessor: 'seeBtn', title: 'ดูข้อมูล' },
                ],
                fetching: false,
                noRecordsText: 'ไม่พบข้อมูล',
              }
        }
      />
    </div>
  );
};

export default TeacherStudentGroupPlayLog;
