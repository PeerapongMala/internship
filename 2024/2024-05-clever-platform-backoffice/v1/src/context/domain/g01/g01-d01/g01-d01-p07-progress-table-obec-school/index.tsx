import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import StoreGlobal from '@global/store/global';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Pagination } from '@mantine/core';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import CwProgress from '@component/web/cw-progress';
import IconSearch from '@component/web/atom/wc-a-icons/IconSearch';
import CWTitleBack from '@component/web/cw-title-back';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import { Thai } from 'flatpickr/dist/l10n/th';
import { useDateRangeStore } from '../local/api/repository/stores';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import dayjs from 'dayjs';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import usePagination from '@global/hooks/usePagination';

interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

interface ITabList {
  key: string;
  label: string;
  url: string;
}

interface IRecords {
  id: number;
  scope: string;
  progress: number;
}

const ProgressTableOBECSchool = () => {
  const navigate = useNavigate();
  const { startDate, endDate, setStartDate, setEndDate, resetDates } =
    useDateRangeStore();
  const { district_zone, area_office, school } = useParams({ strict: false });
  // Sidebar
  useEffect((): void => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);

    if (report_type && selectedFirstDate && selectedEndDate) {
      fetchProgressTable();
    }
  }, []);

  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [fetching, setFetching] = useState(false);

  const [selectedFirstDate, setSelectedFirstDate] = useState<string>(
    startDate?.toString() || '',
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string>(
    endDate?.toString() || '',
  );

  const formattedStart = dayjs(startDate?.toString()).format('M/D/YYYY, h:mm:ss A');
  const formattedEnd = dayjs(endDate?.toString()).format('M/D/YYYY, h:mm:ss A');

  const [selectedTab, setSelectedTab] = useState<string>('obec');
  const tabsList: ITabList[] = [
    { key: '', label: 'รายงานความก้าวหน้า', url: '/admin/report/progress-dashboard' },
    { key: 'obec', label: 'Report สพฐ.', url: '/admin/report/report-obec' },
    { key: 'doe', label: 'Report สนศ. กทม.', url: '/admin/report/report-doe' },
    { key: 'lao', label: 'Report อปท.', url: '/admin/report/report-lao' },
    { key: 'opec', label: 'Report สช.', url: '/admin/report/report-opec' },
    { key: 'other', label: 'อื่นๆ', url: '/admin/report/report-other' },
  ];
  const goTo = (path: string) => {
    navigate({ to: `/${path}` });
  };
  const handleTab = (index: number) => {
    setSelectedTab(tabsList[index].key);
    goTo(tabsList[index].url);
  };

  const [scope, setScope] = useState<string>('year');
  const [parent_scope, setParentScope] = useState<string>(school);
  const [report_type, setReportType] = useState<string>('obec');

  const [progressAvg, setProgressAvg] = useState<number>(0);
  const [records, setRecords] = useState<IRecords[]>([]);

  const columns: DataTableColumn<IRecords>[] = [
    {
      accessor: 'id',
      title: '#',
    },
    {
      accessor: 'scope',
      title: 'ระดับชั้น',
    },
    {
      accessor: 'progress',
      title: 'ค่าความก้าวหน้า',
    },
  ];

  const fetchProgressTable = async () => {
    setFetching(true);
    try {
      const res = await API.ProgressTable.GetListProgressTable({
        page: pagination.page,
        limit: pagination.limit,
        scope: scope,
        parent_scope: parent_scope || undefined,
        report_type: report_type,
        start_date: selectedFirstDate,
        end_date: selectedEndDate,
      });
      if (res.status_code === 200) {
        const rawData = res.data[0].progress_reports;
        const reports: IRecords[] = rawData.map((item, index) => ({
          id: index + 1,
          ...item,
        }));
        setRecords(reports);
        setProgressAvg(res.data[0].average_progress);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination.total_count,
        }));
      }
    } catch (error) {
      showMessage(`Failed to fetch progress dashboard: ${error}`, 'error');
    } finally {
      setFetching(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const res = await API.ProgressTable.DownloadCSVProgressTable({
        scope: scope,
        parent_scope: parent_scope || undefined,
        start_date: selectedFirstDate,
        end_date: selectedEndDate,
      });
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'progress-table.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      showMessage(`Failed to download CSV: ${error}`, 'error');
    }
  };

  useEffect(() => {
    if (report_type && selectedFirstDate && selectedEndDate) {
      fetchProgressTable();
    }
  }, [
    pagination.page,
    pagination.limit,
    scope,
    parent_scope,
    report_type,
    selectedFirstDate,
    selectedEndDate,
  ]);

  return (
    <div className="flex flex-col gap-5">
      <CWBreadcrumbs
        links={[
          {
            label: 'รายงาน',
            href: '/',
            disabled: true,
          },
          {
            label: 'รายงานความก้าวหน้า',
            href: '/',
          },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">รายงานความก้าวหน้า</h1>
      </div>
      <div className="mb-3 grid w-full grid-cols-4 items-center gap-2">
        <WCAInputDateFlat
          placeholder="วว/ดด/ปปปป - วว/ดด/ปปปป"
          options={{
            mode: 'range',
            dateFormat: 'd/m/Y',
            locale: {
              ...Thai,
            },
          }}
          value={[selectedFirstDate, selectedEndDate]}
          onChange={(dates) => {
            setSelectedFirstDate(dates[0]?.toISOString() || '');
            setSelectedEndDate(dates[1]?.toISOString() || '');
            setStartDate(dates[0]?.toISOString() || '');
            setEndDate(dates[1]?.toISOString() || '');
          }}
        />
      </div>

      <CWMTabs
        items={tabsList.map((t) => t.label)}
        currentIndex={tabsList.findIndex((tab) => tab.key === selectedTab)}
        onClick={(index) => handleTab(index)}
      />
      <div>
        <div className="flex flex-col gap-2">
          <div className="rounded-md p-2.5">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  navigate({ to: '../' });
                }}
              >
                <IconArrowBackward />
              </button>
              <p className="text-[26px] font-bold">
                {'Report สพฐ.'} / {district_zone} / {area_office} / {school}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5 rounded-md bg-white p-5 shadow">
            <div className="flex gap-x-[10px]">
              <button
                type="button"
                className="btn btn-primary flex gap-1"
                onClick={handleDownloadCSV}
              >
                <IconDownload />
                Download
              </button>
            </div>

            <div className="w-1/3 gap-5 rounded-md bg-white px-3 py-5 shadow-md">
              <h2 className="pt-4 text-[16px]">ความก้าวหน้าเฉลี่ย:</h2>
              <div className="relative pt-4">
                <h1 className="pb-5 pt-2 text-[28px]">{progressAvg}%</h1>
                <div className="flex w-1/3">
                  <CwProgress percent={progressAvg} />
                </div>
              </div>
            </div>

            <span>{`ระยะเวลาในการแสดงผล ${formattedStart}-${formattedEnd}`}</span>

            <DataTable<IRecords>
              className="table-hover whitespace-nowrap"
              fetching={fetching}
              records={records}
              columns={columns}
              highlightOnHover
              withTableBorder
              withColumnBorders
              height={'calc(100vh - 350px)'}
              noRecordsText="ไม่พบข้อมูล"
              totalRecords={pagination.total_count}
              recordsPerPage={pagination.limit}
              page={pagination.page}
              onPageChange={(page) => {
                setPagination((prev) => ({
                  ...prev,
                  page,
                }));
                setRecords(
                  records.slice((page - 1) * pagination.limit, page * pagination.limit),
                );
              }}
              onRecordsPerPageChange={(limit: number) => {
                setPagination((prev) => ({
                  ...prev,
                  limit,
                  page: 1,
                }));
                setRecords(records.slice(0, limit));
              }}
              recordsPerPageOptions={pageSizeOptions}
              paginationText={({ from, to, totalRecords }) =>
                `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTableOBECSchool;
