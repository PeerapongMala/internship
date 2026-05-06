import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import CWButton from '@component/web/cw-button';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import { useParams } from '@tanstack/react-router';
import CellProgressbar from '../local/component/web/molecule/wc-m-cell-progressbar';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import SchoolStatRootTemplate from '../local/component/web/template/wc-t-school-stat-root';
import { convertTime } from '@domain/g01/g01-d03/local/util';
import {
  SchoolStatSchool,
  SchoolStatClass,
  SchoolStatStudent,
  SchoolStatLesson,
  SchoolStatSubLesson,
  PlayLogStatFilter,
  SchoolStatLevel,
} from '../local/api/group/school-stat/type';
import CWSelect from '@component/web/cw-select';
import SchoolCardBreadcrumb from '../local/component/web/molecule/wc-m-schoolcard-breadcrumb';
import { useSchoolStatDateRangeStore } from '../local/api/repository/stores';
import TextBreadcrumb from '../local/component/web/atom/wc-a-text-breadcrumb';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import dayjs from 'dayjs';
import CWModalQuestionView from '@component/web/cw-modal/cw-modal-question-view';
import { formatTimeString } from '@global/utils/format/time';
import usePagination from '@global/hooks/usePagination';

function PlayLogStat() {
  const {
    schoolId,
    classId,
    studentId,
    lessonId,
    subLessonId,
    levelId,
  }: {
    schoolId: number;
    classId: number;
    studentId: number;
    lessonId: number;
    subLessonId: number;
    levelId: number;
  } = useParams({ strict: false });
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [fetching, setFetching] = useState(true);

  const [parentDetail, setParentDetail] = useState<{
    school: SchoolStatSchool | undefined;
    class: SchoolStatClass | undefined;
    student: SchoolStatStudent | undefined;
    lesson: SchoolStatLesson | undefined;
    sublesson: SchoolStatSubLesson | undefined;
    level: SchoolStatLevel | undefined;
  }>({
    school: undefined,
    class: undefined,
    student: undefined,
    lesson: undefined,
    sublesson: undefined,
    level: undefined,
  });
  const [filterDropdown, setFilterDropdown] = useState<{
    academic_year: any[];
  }>({
    academic_year: [],
  });
  const { startDate, endDate, setStartDate, setEndDate } = useSchoolStatDateRangeStore();

  const [records, setRecords] = useState<any[]>([]);
  const [viewPlayLog, setViewPlayLog] = useState<number>();
  const [filter, setFilter] = useState<PlayLogStatFilter>({
    academic_year: undefined,
  });
  const fetchPlayLogTable = async () => {
    if (!parentDetail.student) {
      return;
    }
    setFetching(true);
    try {
      const res = await API.SchoolStat.GetPlayLogTable({
        page: pagination.page,
        limit: pagination.limit,
        student_user_id: parentDetail.student.user_id,
        level_id: levelId,
        academic_year: filter.academic_year,
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
      const resSubLesson = await API.SchoolStat.GetSubLessonTable({
        page: 1,
        limit: 1,
        student_user_id: dataStudent.user_id,
        lesson_id: lessonId,
        sub_lesson_id: subLessonId,
      });
      const resLevel = await API.SchoolStat.GetLevelTable({
        page: 1,
        limit: 1,
        student_user_id: dataStudent.user_id,
        sub_lesson_id: subLessonId,
      });

      if (
        resLesson.status_code !== 200 ||
        resSubLesson.status_code !== 200 ||
        resLevel.status_code != 200
      ) {
        throw Error('All SubParent API not response correctly!');
      }

      const dataLesson =
        resLesson.data.length > 0
          ? (resLesson.data[0] as unknown as SchoolStatLesson)
          : undefined;

      const dataSubLesson =
        resSubLesson.data.length > 0
          ? (resSubLesson.data[0] as unknown as SchoolStatSubLesson)
          : undefined;
      const dataLevel =
        resLevel.data.length > 0
          ? (resSubLesson.data[0] as unknown as SchoolStatLevel)
          : undefined;

      setParentDetail({
        school: dataSchool,
        class: dataClass,
        student: dataStudent,
        lesson: dataLesson,
        sublesson: dataSubLesson,
        level: dataLevel,
      });
      // Filter
      const resAcademicYear = await API.SchoolStat.DropdownAcademicYearList({
        student_user_id: dataStudent.user_id,
      });
      if (resAcademicYear.status_code !== 200) {
        throw Error('All Dropdown API not response correctly!');
      }
      const dataAcademicYear = resAcademicYear.data as unknown as number[];

      setFilterDropdown({
        academic_year: dataAcademicYear.map((d) => ({
          label: 'ข้อมูลย้อนหลังปี ' + d,
          value: d,
        })),
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
      await API.SchoolStat.DownloadPlayLogCSV({
        student_user_id: parentDetail.student.user_id,
        start_date: startDate,
        end_date: endDate,
        level_id: levelId,
      });
      showMessage('ดาวน์โหลด CSV สำเร็จ');
    } catch (error) {
      showMessage(`การดาวน์โหลดมีปัญหา: ${error}`, 'error');
      throw error;
    }
  };

  const rowColumns: DataTableColumn<any>[] = [
    {
      title: 'ดูคำตอบ',
      accessor: 'seeBtn',

      titleClassName: 'text-right',
      cellsClassName: 'text-right',
      render: ({ id }) => (
        <button
          onClick={() => {
            setViewPlayLog(id);
          }}
        >
          <IconEye />
        </button>
      ),
    },
    {
      title: 'ครั้งที่',
      accessor: 'play_index',
      titleClassName: 'text-right',
      cellsClassName: 'text-right',
    },
    {
      title: 'คะแนน',
      accessor: 'score',
      titleClassName: 'text-right',
      cellsClassName: 'text-right',
      render: ({ score }) => <CellProgressbar value={score} total={3} />,
    },
    {
      title: 'เวลา/ข้อ',
      accessor: 'average_time_used',
      titleClassName: 'text-right',
      cellsClassName: 'text-right',
      render: ({ average_time_used }) => formatTimeString(average_time_used),
    },
    {
      title: 'เวลาทำข้อสอบ',
      accessor: 'played_at',
      render: ({ played_at }) => convertTime(played_at),
    },
  ];

  useEffect(() => {
    fetchPlayLogTable();
  }, [
    pagination.limit,
    pagination.page,
    parentDetail.student,
    filter.academic_year,
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
      {parentDetail.lesson && parentDetail.sublesson && (
        <TextBreadcrumb
          list={[
            parentDetail.lesson.curriculum_group_short_name,
            parentDetail.lesson.subject,
            parentDetail.lesson.lesson_name,
            parentDetail.sublesson.sub_lesson_name,
          ]}
        />
      )}
      <div className="panel flex flex-col gap-5">
        <div className="flex gap-2">
          <CWSelect
            title="ข้อมูลย้อนหลัง"
            options={filterDropdown.academic_year}
            required={false}
            className="w-[200px]"
            onChange={(event) =>
              setFilter((prev) => ({
                ...prev,
                academic_year: event.target.value,
              }))
            }
            value={filter.academic_year}
          />
          <WCAInputDateFlat
            className="w-[250px]"
            options={{
              mode: 'range',
              dateFormat: 'd/m/Y',
            }}
            onChange={(date) => {
              setStartDate(dayjs(date[0]).startOf('day').toISOString());
              setEndDate(dayjs(date[1]).endOf('day').toISOString());
            }}
          />
          <CWButton
            className="ms-auto px-3 font-bold"
            onClick={() => downloadCSVSchoolTable()}
            icon={<IconDownload />}
            title="Download"
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
      <CWModalQuestionView
        open={typeof viewPlayLog !== 'undefined'}
        onClose={() => setViewPlayLog(undefined)}
        levelId={levelId}
        levelPlayLogId={viewPlayLog}
        useSchoolStatAPI={true}
      />
    </SchoolStatRootTemplate>
  );
}

export default PlayLogStat;
