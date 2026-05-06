import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import CWButton from '@component/web/cw-button';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import CWInputSearch from '@component/web/cw-input-search';
import { useNavigate, useParams } from '@tanstack/react-router';
import CellProgressbar from '../local/component/web/molecule/wc-m-cell-progressbar';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import SchoolStatRootTemplate from '../local/component/web/template/wc-t-school-stat-root';
import { convertTime } from '@domain/g01/g01-d03/local/util';
import {
  SchoolStatSchool,
  SchoolStatClass,
  SchoolStatStudent,
  CurriculumGroupDropdown,
  SubjectDropdown,
  LessonDropdown,
  LessonStatFilter,
} from '../local/api/group/school-stat/type';
import CWSelect from '@component/web/cw-select';
import SchoolCardBreadcrumb from '../local/component/web/molecule/wc-m-schoolcard-breadcrumb';
import { useSchoolStatDateRangeStore } from '../local/api/repository/stores';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import dayjs from 'dayjs';
import { formatTimeString } from '@global/utils/format/time';
import usePagination from '@global/hooks/usePagination';
import React from 'react';
import { FetchOptions } from '@global/utils/fetchWithAuth';

function LessonStat() {
  const {
    schoolId,
    classId,
    studentId,
  }: {
    schoolId: number;
    classId: number;
    studentId: number;
  } = useParams({ strict: false });
  const navigate = useNavigate();
  const { pagination, setPagination } = usePagination();
  const [fetching, setFetching] = useState(true);
  const MemoBreadcrumb = React.memo(SchoolCardBreadcrumb);

  const [parentDetail, setParentDetail] = useState<{
    school: SchoolStatSchool | undefined;
    class: SchoolStatClass | undefined;
    student: SchoolStatStudent | undefined;
  }>({
    school: undefined,
    class: undefined,
    student: undefined,
  });
  const [filterDropdown, setFilterDropdown] = useState<{
    curriculum: any[];
    subject: any[];
    lesson: any[];
  }>({
    curriculum: [],
    subject: [],
    lesson: [],
  });
  const { startDate, endDate, setStartDate, setEndDate } = useSchoolStatDateRangeStore();

  const [records, setRecords] = useState<any[]>([]);
  const [filter, setFilter] = useState<LessonStatFilter>({
    curriculum_group_id: undefined,
    subject_id: undefined,
    lesson_id: undefined,
    search_value: '',
  });
  const fetchLessonDetailTable = async (abortController?: AbortController) => {
    if (!parentDetail.student) return;

    setFetching(true);
    try {
      const res = await API.SchoolStat.GetLessonTable(
        {
          page: pagination.page,
          limit: pagination.limit,
          student_user_id: parentDetail.student.user_id,
          curriculum_group_id: filter.curriculum_group_id,
          subject_id: filter.subject_id,
          lesson_id: filter.lesson_id,
          search_text: filter.search_value,
          start_date: startDate,
          end_date: endDate,
          class_id: classId,
        },
        { signal: abortController?.signal },
      );

      if (res.status_code === 200) {
        setRecords(res.data);
        setPagination((prev) => ({ ...prev, total_count: res._pagination.total_count }));
      } else {
        throw new Error('Failed to fetch lesson table');
      }
    } catch (error) {
      if (error instanceof Error && error.name == 'AbortError') {
        return;
      }

      showMessage(`Failed to fetch: ${error}`, 'error');
    } finally {
      setFetching(false);
    }
  };

  const fetchParentDetail = async (abortController?: AbortController) => {
    const options: FetchOptions = {
      signal: abortController?.signal,
    };

    try {
      const reqSchool = API.SchoolStat.GetSchoolTable(
        {
          page: 1,
          limit: 1,
          school_id: schoolId,
        },
        options,
      );
      const reqClass = API.SchoolStat.GetClassTable(
        {
          page: 1,
          limit: 1,
          school_id: schoolId,
          class_id: classId,
        },
        options,
      );
      const reqStudent = API.SchoolStat.GetStudentTable(
        {
          page: 1,
          limit: 1,
          student_id: studentId,
          class_id: classId,
        },
        options,
      );

      const [resSchool, resClass, resStudent] = await Promise.all([
        reqSchool,
        reqClass,
        reqStudent,
      ]);

      if (
        resSchool.status_code !== 200 ||
        resClass.status_code !== 200 ||
        resStudent.status_code !== 200
      ) {
        throw Error('All ParentDetail API not response correctly!');
      }
      const dataSchool =
        resSchool.data.length > 0
          ? (resSchool.data[0] as unknown as SchoolStatSchool)
          : undefined;
      const dataClass =
        resClass.data.length > 0
          ? (resClass.data[0] as unknown as SchoolStatClass)
          : undefined;

      const dataStudent =
        resStudent.data.length > 0
          ? (resStudent.data[0] as unknown as SchoolStatStudent)
          : undefined;
      setParentDetail({
        school: dataSchool,
        class: dataClass,
        student: dataStudent,
      });

      if (!dataStudent) {
        throw Error('Student user ID');
      }

      // Filter
      const reqCurriculum = API.SchoolStat.DropdownCurriculumGroups(
        {
          student_user_id: dataStudent.user_id,
        },
        options,
      );
      const reqSubject = API.SchoolStat.DropdownSubjectList(
        {
          student_user_id: dataStudent.user_id,
        },
        options,
      );
      const reqLesson = API.SchoolStat.DropdownLessonList(
        {
          student_user_id: dataStudent.user_id,
        },
        options,
      );

      const [resCurriculum, resSubject, resLesson] = await Promise.all([
        reqCurriculum,
        reqSubject,
        reqLesson,
      ]);

      if (
        resCurriculum.status_code !== 200 ||
        resSubject.status_code !== 200 ||
        resLesson.status_code !== 200
      ) {
        throw Error('All Dropdown API not response correctly!');
      }
      const dataCurriculum = resCurriculum.data as unknown as CurriculumGroupDropdown[];
      const dataSubject = resSubject.data as unknown as SubjectDropdown[];
      const dataLesson = resLesson.data as unknown as LessonDropdown[];

      setFilterDropdown({
        curriculum: dataCurriculum.map((d) => ({ label: d.name, value: d.id })),
        subject: dataSubject.map((d) => ({ label: d.name, value: d.id })),
        lesson: dataLesson.map((d) => ({ label: d.name, value: d.id })),
      });
    } catch (error) {
      if (error instanceof Error && error.name == 'AbortError') {
        return;
      }

      showMessage(`Failed to fetch: ${error}`, 'error');
    }
  };

  const downloadCSVSchoolTable = async () => {
    if (!parentDetail.student) {
      return;
    }
    try {
      await API.SchoolStat.DownloadLessonCSV({
        student_user_id: parentDetail.student.user_id,
        start_date: startDate,
        end_date: endDate,
      });
      showMessage('ดาวน์โหลด CSV สำเร็จ');
    } catch (error) {
      showMessage(`การดาวน์โหลดมีปัญหา: ${error}`, 'error');
      throw error;
    }
  };

  const rowColumns: DataTableColumn<any>[] = [
    {
      title: 'ดูข้อมูล',
      accessor: 'seeBtn',
      width: 80,
      titleClassName: 'text-center',
      cellsClassName: 'text-center',
      render: ({ lesson_id }) => (
        <button
          onClick={() => {
            navigate({
              to: `/admin/report/school-stat/school/${schoolId}/class/${classId}/student/${studentId}/lesson/${lesson_id}`,
            });
          }}
        >
          <IconEye />
        </button>
      ),
    },
    {
      accessor: 'index',
      title: '#',
      render: (_: any, index: number) => index + 1,
    },
    {
      title: 'สังกัดวิชา',
      accessor: 'curriculum_group_short_name',
    },
    {
      title: 'วิชา',
      accessor: 'subject',
    },
    {
      title: 'บทเรียนหลัก',
      accessor: 'lesson_name',
    },
    {
      title: 'ด่านที่ผ่าน',
      accessor: 'passed_level_count',
      titleClassName: 'text-right',
      cellsClassName: 'text-right',
      render: ({ passed_level_count, total_level_count }) => (
        <CellProgressbar value={passed_level_count} total={total_level_count} />
      ),
    },
    {
      title: 'คะแนนรวม',
      accessor: 'score_pass',
      titleClassName: 'text-right',
      cellsClassName: 'text-right',
      render: ({ score, total_score }) => (
        <CellProgressbar value={score} total={total_score} />
      ),
    },
    {
      title: 'ทำแบบฝึกหัด(ครั้ง)',
      accessor: 'play_count',
      titleClassName: 'text-right',
      cellsClassName: 'text-right',
      render: ({ play_count }) =>
        new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(play_count),
    },
    {
      title: 'เวลาเฉลี่ย/ข้อ',
      accessor: 'average_time_used',
      titleClassName: 'text-right',
      cellsClassName: 'text-right',
      render: ({ average_time_used }) => formatTimeString(average_time_used),
    },
    {
      title: 'เข้าระบบล่าสุด',
      accessor: 'last_login',
      render: ({ last_login }) => convertTime(last_login),
    },
  ];

  useEffect(() => {
    const controller = new AbortController();

    fetchLessonDetailTable(controller);

    return () => {
      controller.abort();
    };
  }, [
    pagination.limit,
    pagination.page,
    filter.curriculum_group_id,
    filter.subject_id,
    filter.lesson_id,
    filter.search_value,
    parentDetail.student,
    startDate,
    endDate,
  ]);
  useEffect(() => {
    const controller = new AbortController();
    fetchParentDetail(controller);

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <SchoolStatRootTemplate showBackButton={true}>
      {parentDetail.school && parentDetail.class && (
        <MemoBreadcrumb
          list={[
            parentDetail.school.school_name,
            `ปีการศึกษา ${parentDetail.class.academic_year} - ${parentDetail.class.class_year}/${parentDetail.class.class_name}`,
            `${parentDetail.student?.title}${parentDetail.student?.first_name} ${parentDetail.student?.last_name}`,
          ]}
          subtext={`รหัสโรงเรียน: ${parentDetail.school?.school_code} (ตัวย่อ: ${parentDetail.school?.school_id.toString()})`}
        />
      )}

      <div className="panel flex flex-col gap-5">
        <div className="flex flex-1 justify-between gap-2">
          <CWInputSearch
            placeholder="ค้นหา"
            onChange={(event) =>
              setFilter((prev) => ({
                ...prev,
                search_value: event.target.value,
              }))
            }
          />
          <CWButton
            className="gap-2 !px-3 !font-bold"
            onClick={() => downloadCSVSchoolTable()}
            icon={<IconDownload />}
            title="Download"
          />
        </div>
        <div className="flex gap-2">
          <WCAInputDateFlat
            className="w-[200px]"
            options={{
              mode: 'range',
              dateFormat: 'd/m/Y',
            }}
            onChange={(date) => {
              setStartDate(dayjs(date[0]).startOf('day').toISOString());
              setEndDate(dayjs(date[1]).endOf('day').toISOString());
            }}
            //value={[dayjs(startDate).toDate(), dayjs(endDate).toDate()]}
          />
          <CWSelect
            title="สังกัดวิชา"
            options={filterDropdown.curriculum}
            required={false}
            className="w-[200px]"
            onChange={(event) =>
              setFilter((prev) => ({
                ...prev,
                curriculum_group_id: event.target.value,
              }))
            }
            value={filter.curriculum_group_id}
          />
          <CWSelect
            title="วิชา"
            options={filterDropdown.subject}
            required={false}
            className="w-[200px]"
            onChange={(event) =>
              setFilter((prev) => ({
                ...prev,
                subject_id: event.target.value,
              }))
            }
            value={filter.subject_id}
          />
          <CWSelect
            title="บทเรียน"
            options={filterDropdown.lesson}
            required={false}
            className="w-[200px]"
            onChange={(event) =>
              setFilter((prev) => ({
                ...prev,
                lesson_id: event.target.value,
              }))
            }
            value={filter.lesson_id}
          />
        </div>
        <DataTable
          className="table-hover whitespace-nowrap"
          fetching={fetching}
          records={records}
          columns={rowColumns}
          highlightOnHover
          withTableBorder
          withColumnBorders
          height="calc(100vh - 350px)"
          noRecordsText="ไม่พบข้อมูล"
          totalRecords={pagination.total_count}
          recordsPerPage={pagination.limit}
          page={pagination.page}
          onPageChange={(page) => {
            setPagination((prev) => ({
              ...prev,
              page,
            }));
          }}
          onRecordsPerPageChange={(recordsPerPage: number) =>
            setPagination((prev) => ({
              ...prev,
              limit: recordsPerPage,
              page: 1,
            }))
          }
          recordsPerPageOptions={[10, 25, 50, 100]}
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
          }
        />
      </div>
    </SchoolStatRootTemplate>
  );
}

export default LessonStat;
