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
import { SchoolStatSchool } from '../local/api/group/school-stat/type';
import CWSchoolCard from '@component/web/cw-school-card';
import { useSchoolStatDateRangeStore } from '../local/api/repository/stores';
import { formatTimeString } from '@global/utils/format/time';
import usePagination from '@global/hooks/usePagination';

function ClassStat() {
  const {
    schoolId,
  }: {
    schoolId: number;
  } = useParams({ strict: false });
  const navigate = useNavigate();
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [fetching, setFetching] = useState(true);

  const [school, setSchool] = useState<SchoolStatSchool | undefined>();
  const [records, setRecords] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const { startDate, endDate } = useSchoolStatDateRangeStore();

  const fetchClassDetailTable = async () => {
    setFetching(true);
    try {
      const res = await API.SchoolStat.GetClassTable({
        page: pagination.page,
        limit: pagination.limit,
        school_id: schoolId,
        search_text: search,
        start_date: startDate,
        end_date: endDate,
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
  const fetchSchoolDetail = async () => {
    try {
      const res = await API.SchoolStat.GetSchoolTable({
        page: 1,
        limit: 1,
        school_id: schoolId,
      });
      if (res.status_code === 200) {
        const dataSchool =
          res.data.length > 0 ? (res.data[0] as unknown as SchoolStatSchool) : undefined;
        setSchool(dataSchool);
      }
    } catch (error) {
      showMessage(`Failed to fetch: ${error}`, 'error');
    }
  };

  const downloadCSVSchoolTable = async (): Promise<void> => {
    if (!schoolId) return;
    try {
      await API.SchoolStat.DownloadClassCSV({
        school_id: schoolId,
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
      accessor: 'class_id',
      width: 80,
      titleClassName: 'text-center',
      cellsClassName: 'text-center',
      render: ({ class_id }) => (
        <button
          onClick={() => {
            navigate({
              to: `/admin/report/school-stat/school/${schoolId}/class/${class_id}`,
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
      title: 'ปีการศึกษา',
      accessor: 'academic_year',
    },
    {
      title: 'ระดับชั้น',
      accessor: 'class_year',
    },
    {
      title: 'ห้อง',
      accessor: 'class_name',
    },
    {
      title: 'จำนวนนักเรียน(คน)',
      accessor: 'student_count',
    },
    {
      title: 'ด่านที่ผ่าน',
      accessor: 'stage_pass_avg',
      titleClassName: 'text-right',
      cellsClassName: 'text-right',
      render: ({ average_passed_level, total_levels_count }) => (
        <p>{average_passed_level}</p>
      ),
    },
    {
      title: 'คะแนนรวม',
      accessor: 'total_score_avg',
      titleClassName: 'text-right',
      cellsClassName: 'text-right',
      render: ({ average_score, total_score }) => <p>{average_score}</p>,
    },
    {
      title: 'ทำแบบฝึกหัดเฉลี่ย (ครั้ง)',
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
  ];

  useEffect(() => {
    fetchClassDetailTable();
  }, [pagination.limit, pagination.page, search]);

  return (
    <SchoolStatRootTemplate showBackButton={true}>
      {school && (
        <CWSchoolCard
          name={school?.school_name}
          code={school?.school_code}
          subCode={school?.school_id.toString()}
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

export default ClassStat;
