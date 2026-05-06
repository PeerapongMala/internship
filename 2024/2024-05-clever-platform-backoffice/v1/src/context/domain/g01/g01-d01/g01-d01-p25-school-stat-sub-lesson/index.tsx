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
  LessonDropdown,
  SubLessonStatFilter,
  SchoolStatLesson,
} from '../local/api/group/school-stat/type';
import CWSelect from '@component/web/cw-select';
import SchoolCardBreadcrumb from '../local/component/web/molecule/wc-m-schoolcard-breadcrumb';
import { useSchoolStatDateRangeStore } from '../local/api/repository/stores';
import TextBreadcrumb from '../local/component/web/atom/wc-a-text-breadcrumb';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import dayjs from 'dayjs';
import { formatTimeString } from '@global/utils/format/time';
import usePagination from '@global/hooks/usePagination';

function SubLessonStat() {
  const {
    schoolId,
    classId,
    studentId,
    lessonId,
  }: {
    schoolId: number;
    classId: number;
    studentId: number;
    lessonId: number;
  } = useParams({ strict: false });
  const navigate = useNavigate();
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [fetching, setFetching] = useState(true);

  const [parentDetail, setParentDetail] = useState<{
    school: SchoolStatSchool | undefined;
    class: SchoolStatClass | undefined;
    student: SchoolStatStudent | undefined;
    lesson: SchoolStatLesson | undefined;
  }>({
    school: undefined,
    class: undefined,
    student: undefined,
    lesson: undefined,
  });
  const [filterDropdown, setFilterDropdown] = useState<{
    sublesson: any[];
  }>({
    sublesson: [],
  });
  const { startDate, endDate, setStartDate, setEndDate } = useSchoolStatDateRangeStore();

  const [records, setRecords] = useState<any[]>([]);
  const [filter, setFilter] = useState<SubLessonStatFilter>({
    sub_lesson_id: undefined,
    search_value: '',
  });
  const fetchSubLessonDetailTable = async () => {
    if (!parentDetail.student) {
      return;
    }
    setFetching(true);
    try {
      const res = await API.SchoolStat.GetSubLessonTable({
        page: pagination.page,
        limit: pagination.limit,
        student_user_id: parentDetail.student.user_id,
        lesson_id: lessonId,
        sub_lesson_id: filter.sub_lesson_id,
        search_text: filter.search_value,
        start_date: startDate,
        end_date: endDate,
        class_id: classId,
      });
      if (res.status_code === 200) {
        setRecords(res.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination.total_count,
        }));
      }
    } catch (error) {
      showMessage(`Failed to fetch: ${error}`, 'error');
    } finally {
      setFetching(false);
    }
  };
  const fetchParentDetail = async () => {
    try {
      const resSchool = await API.SchoolStat.GetSchoolTable({
        page: 1,
        limit: 1,
        school_id: schoolId,
      });
      const resClass = await API.SchoolStat.GetClassTable({
        page: 1,
        limit: 1,
        school_id: schoolId,
        class_id: classId,
      });
      const resStudent = await API.SchoolStat.GetStudentTable({
        page: 1,
        limit: 1,
        student_id: studentId,
        class_id: classId,
      });

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

      if (!dataStudent) {
        throw Error('Student user ID');
      }

      const resLesson = await API.SchoolStat.GetLessonTable({
        page: 1,
        limit: 1,
        student_user_id: dataStudent.user_id,
        lesson_id: lessonId,
      });

      if (resLesson.status_code !== 200) {
        throw Error('All SubParent API not response correctly!');
      }

      const dataLesson =
        resLesson.data.length > 0
          ? (resLesson.data[0] as unknown as SchoolStatLesson)
          : undefined;

      setParentDetail({
        school: dataSchool,
        class: dataClass,
        student: dataStudent,
        lesson: dataLesson,
      });
      // Filter
      const resSubLesson = await API.SchoolStat.DropdownSubLessonList({
        student_user_id: dataStudent.user_id,
        lesson_id: lessonId,
      });
      if (resSubLesson.status_code !== 200) {
        throw Error('All Dropdown API not response correctly!');
      }
      const dataSubLesson = resSubLesson.data as unknown as LessonDropdown[];

      setFilterDropdown({
        sublesson: dataSubLesson.map((d) => ({ label: d.name, value: d.id })),
      });
    } catch (error) {
      showMessage(`Failed to fetch: ${error}`, 'error');
    }
  };

  const downloadCSVSchoolTable = async () => {
    if (!parentDetail.student) {
      return;
    }
    try {
      await API.SchoolStat.DownloadSubLessonCSV({
        student_user_id: parentDetail.student.user_id,
        start_date: startDate,
        end_date: endDate,
        lesson_id: lessonId,
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
      render: ({ sub_lesson_id }) => (
        <button
          onClick={() => {
            navigate({
              to: `/admin/report/school-stat/school/${schoolId}/class/${classId}/student/${studentId}/lesson/${lessonId}/sub-lesson/${sub_lesson_id}`,
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
      title: 'บทเรียนย่อย',
      accessor: 'sub_lesson_name',
    },
    {
      title: 'ด่านที่ผ่านโดยเฉลี่ย',
      accessor: 'stage_pass_avg',
      cellsClassName: 'text-right',
      render: ({ passed_level_count, total_level_count }) => (
        <CellProgressbar value={passed_level_count} total={total_level_count} />
      ),
    },
    {
      title: 'คะแนนรวมโดยเฉลี่ย',
      accessor: 'total_score_avg',
      titleClassName: 'text-right',
      cellsClassName: 'text-right',
      render: ({ score, total_score }) => (
        <CellProgressbar value={score} total={total_score} />
      ),
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
      accessor: 'last_played',
      render: ({ last_played }) => convertTime(last_played),
    },
  ];

  useEffect(() => {
    fetchSubLessonDetailTable();
  }, [
    pagination.limit,
    pagination.page,
    filter.sub_lesson_id,
    filter.search_value,
    parentDetail.student,
    startDate,
    endDate,
  ]);
  useEffect(() => {
    fetchParentDetail();
  }, []);

  return (
    <SchoolStatRootTemplate showBackButton={true}>
      {parentDetail.school && parentDetail.class && (
        <SchoolCardBreadcrumb
          list={[
            parentDetail.school.school_name,
            `ปีการศึกษา ${parentDetail.class.academic_year} - ${parentDetail.class.class_year}/${parentDetail.class.class_name}`,
            `${parentDetail.student?.title}${parentDetail.student?.first_name} ${parentDetail.student?.last_name}`,
          ]}
          subtext={`รหัสโรงเรียน: ${parentDetail.school?.school_code} (ตัวย่อ: ${parentDetail.school?.school_id.toString()})`}
        />
      )}
      {parentDetail.lesson && (
        <TextBreadcrumb
          list={[
            parentDetail.lesson.curriculum_group_short_name,
            parentDetail.lesson.subject,
            parentDetail.lesson.lesson_name,
          ]}
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
            options={{
              mode: 'range',
              dateFormat: 'd/m/Y',
            }}
            onChange={(date) => {
              setStartDate(dayjs(date[0]).startOf('day').toISOString());
              setEndDate(dayjs(date[1]).endOf('day').toISOString());
            }}
          />
          <CWSelect
            title="บทเรียน"
            options={filterDropdown.sublesson}
            required={false}
            className="w-[200px]"
            onChange={(event) =>
              setFilter((prev) => ({
                ...prev,
                sub_lesson_id: event.target.value,
              }))
            }
            value={filter.sub_lesson_id}
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
          recordsPerPageOptions={pageSizeOptions}
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
          }
        />
      </div>
    </SchoolStatRootTemplate>
  );
}

export default SubLessonStat;
