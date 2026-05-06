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
import { SchoolStatSchool, SchoolStatClass } from '../local/api/group/school-stat/type';
import SchoolCardBreadcrumb from '../local/component/web/molecule/wc-m-schoolcard-breadcrumb';
import { useSchoolStatDateRangeStore } from '../local/api/repository/stores';
import { formatTimeString } from '@global/utils/format/time';
import usePagination from '@global/hooks/usePagination';

function StudentStat() {
  const {
    schoolId,
    classId,
  }: {
    schoolId: number;
    classId: number;
  } = useParams({ strict: false });
  const navigate = useNavigate();
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [fetching, setFetching] = useState(true);

  const [parentDetail, setParentDetail] = useState<{
    school: SchoolStatSchool | undefined;
    class: SchoolStatClass | undefined;
  }>({
    school: undefined,
    class: undefined,
  });
  const { startDate, endDate } = useSchoolStatDateRangeStore();

  const [records, setRecords] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const fetchStudentDetailTable = async () => {
    setFetching(true);
    try {
      const res = await API.SchoolStat.GetStudentTable({
        page: pagination.page,
        limit: pagination.limit,
        class_id: classId,
        search_text: search,
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
  // const fetchParentDetail = async () => {
  //   try {
  //     const resSchool = await API.SchoolStat.GetSchoolTable({
  //       page: 1,
  //       limit: 1,
  //       school_id: schoolId,
  //     });
  //     const resClass = await API.SchoolStat.GetClassTable({
  //       page: 1,
  //       limit: 1,
  //       school_id: schoolId,
  //       class_id: classId,
  //     });

  //     if (resSchool.status_code === 200 && resClass.status_code === 200) {
  //       const dataSchool =
  //         resSchool.data.length > 0
  //           ? (resSchool.data[0] as unknown as SchoolStatSchool)
  //           : undefined;
  //       const dataClass =
  //         resClass.data.length > 0
  //           ? (resClass.data[0] as unknown as SchoolStatClass)
  //           : undefined;

  //       setParentDetail({
  //         school: dataSchool,
  //         class: dataClass,
  //       });
  //     }
  //   } catch (error) {
  //     showMessage(`Failed to fetch: ${error}`, 'error');
  //   }
  // };

  const downloadCSVSchoolTable = async () => {
    try {
      await API.SchoolStat.DownloadStudentCSV({
        class_id: classId,
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
      render: ({ student_id }) => (
        <button
          onClick={() => {
            navigate({
              to: `/admin/report/school-stat/school/${schoolId}/class/${classId}/student/${student_id}`,
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
      title: 'รหัสนักเรียน',
      accessor: 'student_id',
    },
    {
      title: 'คำนำหน้า',
      accessor: 'title',
    },
    {
      title: 'ชื่อ',
      accessor: 'first_name',
    },
    {
      title: 'สกุล',
      accessor: 'last_name',
    },
    {
      title: 'ด่านที่ผ่าน',
      accessor: 'passed_level_count',
      titleClassName: 'text-right',
      cellsClassName: 'text-right',
      render: ({ passed_level_count, total_levels_count }) => (
        <CellProgressbar value={passed_level_count} total={total_levels_count} />
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
    fetchStudentDetailTable();
  }, [pagination.limit, pagination.page, search]);

  return (
    <SchoolStatRootTemplate showBackButton={true}>
      {parentDetail.school && parentDetail.class && (
        <SchoolCardBreadcrumb
          list={[
            parentDetail.school?.school_name,
            `ปีการศึกษา ${parentDetail.class.academic_year} - ${parentDetail.class.class_year}/${parentDetail.class.class_name}`,
          ]}
          subtext={`รหัสโรงเรียน: ${parentDetail.school?.school_code} (ตัวย่อ: ${parentDetail.school?.school_id.toString()})`}
        />
      )}

      <div className="panel flex flex-col gap-5">
        <div className="flex flex-1 justify-between gap-2">
          <CWInputSearch
            placeholder="ค้นหา"
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <CWButton
            className="gap-2 !px-3 !font-bold"
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
    </SchoolStatRootTemplate>
  );
}

export default StudentStat;
