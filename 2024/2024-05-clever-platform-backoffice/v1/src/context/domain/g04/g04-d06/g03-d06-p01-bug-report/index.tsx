import StoreGlobalPersist from '@store/global/persist';
import { useEffect, useState, useMemo } from 'react';
import { BugReportStatus, Curriculum } from '../local/type';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { toDateTimeTH } from '@global/utils/date';
import { Link, useNavigate } from '@tanstack/react-router';
import StoreGlobal from '@store/global';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import Tabs from '@component/web/cw-tabs';
import CWInputSearch from '@component/web/cw-input-search';
import CWWhiteBox from '@component/web/cw-white-box';
import CWSelect from '@component/web/cw-select';
import CWButton from '@component/web/cw-button';
import IconDownload from '@component/web/atom/wc-a-icons/IconDownload';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import API from '../local/api/index';
import showMessage from '@global/utils/showMessage.ts';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import { type, pathformOptions, priority } from '../local/components/option';
import { IBugReportProps } from '@domain/g04/g04-d05/local/type';
import { ICreateBugReportQueryParams } from '../local/api/repository/bugReport';
import usePagination from '@global/hooks/usePagination';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const DomainJSX = () => {
  const navigate = useNavigate();
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      navigate({ to: '/' });
    }
  }, []);

  const modalDownload = useModal();

  const [filterIndicator, setFilterIndicator] = useState<ICreateBugReportQueryParams>({
    page: 0,
    limit: 10,
    status: '',
    platform: '',
    type: '',
    priority: '',
    start_date: '',
    end_date: '',
    search_text: '',
  });
  const [fetching, setFetching] = useState<boolean>(false);
  const [initialState, setInitialState] = useState<number>(0);
  const [records, setRecords] = useState<IBugReportProps[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  useEffect(() => {
    const fetchMockData = async () => {
      setFetching(true);
      try {
        const res = await API.bugReport.GetG04D06A01({
          page: pagination?.page,
          limit: pagination?.limit,
          status: filterIndicator?.status || '',
          platform: filterIndicator?.platform,
          type: filterIndicator?.type,
          priority: filterIndicator?.priority,
          start_date: filterIndicator?.start_date,
          end_date: filterIndicator?.end_date,
          search_text: filterIndicator?.search_text,
        });

        console.log(res);
        if (res.status_code === 200) {
          let filterData = res.data ?? [];

          setInitialState(res._pagination?.total_count || 0);
          setRecords(filterData);
          setPagination((prev) => ({ ...prev, total_count: filterData?.length || 0 }));
          setFetching(false);
        }
      } catch (error) {
        setFetching(false);
        showMessage(`Failed to fetch account students: ${error}`, 'error');
      }
    };
    fetchMockData();
  }, [filterIndicator]);

  const columnDefs = useMemo<DataTableColumn<IBugReportProps>[]>(() => {
    const finalDefs: DataTableColumn<IBugReportProps>[] = [
      {
        accessor: 'edit',
        title: 'ดู',

        render: ({ id }) => (
          <Link to="./$reportId/edit" params={{ reportId: id }}>
            <IconEye />
          </Link>
        ),
      },
      { accessor: 'id', title: 'รหัสปัญหา' },
      {
        accessor: 'created_at',
        title: 'แก้ไขล่าสุด',
        render: ({ created_at }) => {
          return created_at ? toDateTimeTH(created_at) : '-';
        },
      },
      { accessor: 'os', title: 'ระบบปฎิบัติการ' },
      { accessor: 'browser', title: 'เบราว์เซอร์' },
      {
        accessor: 'type',
        title: 'ประเภทปัญหา',
        render(record) {
          const _type = type.find((_type) => _type.value == record.type);
          return _type?.label ?? record.type;
        },
      },
      { accessor: 'description', title: 'ปัญหา' },
      {
        accessor: 'url',
        title: 'URL',
        render(record) {
          return record.url ? (
            <a target="_blank" href={record.url}>
              {record.url}
            </a>
          ) : (
            '-'
          );
        },
      },
      { accessor: 'version', title: 'เวอร์ชั่น' },
      { accessor: 'created_by', title: 'แจ้งโดย' },
      { accessor: 'role', title: 'ตำแหน่ง' },
      {
        accessor: 'priority',
        title: 'ความสำคัญ',
        render(record) {
          const _priority = priority.find((pri) => pri.value == record.priority);
          return _priority?.label ?? record.priority;
        },
      },
      {
        accessor: 'status',
        title: 'สถานะ',
        render: ({ status }) => {
          if (status === BugReportStatus.WAITING)
            return <span className="badge badge-outline-info">รอตรวจสอบ</span>;
          else if (status === BugReportStatus.EDITING)
            return <span className="badge badge-outline-warning">กำลังแก้ไข</span>;
          else if (status === BugReportStatus.SUCCESS)
            return <span className="badge badge-outline-success">แก้ไขสำเร็จ</span>;
          else if (status === BugReportStatus.CLOSING)
            return <span className="badge badge-outline-dark">ปิดงาน</span>;
        },
      },
    ];

    return finalDefs;
  }, [filterIndicator]);

  const paginatedRecords = useMemo(() => {
    return records.slice(
      (pagination.page - 1) * pagination.limit,
      pagination.page * pagination.limit,
    );
  }, [records, pagination.page, pagination.limit]);

  const onConfirmDownload = async () => {
    try {
      API.bugReport.GetG04D06A05({ startDate: startDate || '', endDate: endDate || '' });
      modalDownload.close();
    } catch (error) {
      showMessage(`Failed to download: ${error}`, 'error');
    }
  };

  const handleOnChangeRangeDate = (date: Date[]) => {
    if (date && date?.length === 2) {
      setFilterIndicator({
        ...filterIndicator,
        start_date: date[0]?.toISOString()?.split('T')[0] || '',
        end_date: date[1]?.toISOString()?.split('T')[0] || '',
      });
    }
  };

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'ระบบเกม', href: '#' },
          { label: 'ปัญหาการใช้งาน', href: '#' },
        ]}
      />

      <div className="mt-5 flex w-full flex-col gap-3">
        <h1 className="text-[26px] font-bold">ปัญหาการใช้งาน</h1>
        <p>{initialState} รายการ</p>
      </div>

      <CWWhiteBox className="mt-5">
        <div className="flex w-full justify-between gap-3">
          <div className="flex gap-3">
            <CWInputSearch
              placeholder="ค้นหา"
              onChange={(e) => {
                setFilterIndicator({
                  ...filterIndicator,
                  search_text: e?.target?.value,
                });
              }}
            />
          </div>

          <div className="flex gap-x-[10px]">
            {/* modal download */}
            <CWButton
              title="Download"
              icon={<IconDownload />}
              onClick={modalDownload.open}
            />
            <CWModalDownload
              onDownload={onConfirmDownload}
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              open={modalDownload.isOpen}
              onClose={modalDownload.close}
            />
          </div>
        </div>
        {/* filter */}
        <div className="my-5 grid grid-cols-6 gap-5">
          <WCAInputDateFlat
            options={{
              mode: 'range',
              dateFormat: 'd/m/Y',
            }}
            onChange={(data) => {
              handleOnChangeRangeDate(data);
            }}
            placeholder="ช่วงวันที่แจ้งปัญหา"
            className="col-span-1"
          />
          <CWSelect
            options={pathformOptions}
            value={filterIndicator?.platform}
            title="แพลตฟอร์ม"
            className="col-span-1"
            onChange={(selectedOption) => {
              if (selectedOption) {
                setFilterIndicator((prev) => ({
                  ...prev,
                  platform: selectedOption?.target?.value,
                }));
              }
            }}
          />
          <CWSelect
            options={type}
            value={filterIndicator?.type}
            title="หมวดหมู่"
            className="col-span-1"
            onChange={(selectedOption) => {
              if (selectedOption) {
                setFilterIndicator((prev) => ({
                  ...prev,
                  type: selectedOption?.target?.value,
                }));
              }
            }}
          />
          <CWSelect
            title="ความสำคัญ"
            className="col-span-1"
            options={priority}
            value={filterIndicator?.priority}
            onChange={(selectedOption) => {
              if (selectedOption) {
                setFilterIndicator((prev) => ({
                  ...prev,
                  priority: selectedOption?.target?.value,
                }));
              }
            }}
          />
        </div>

        <div className="w-full">
          <Tabs
            currentTab={filterIndicator?.status}
            setCurrentTab={(value) => {
              setFilterIndicator({
                ...filterIndicator,
                status: (value || '') as string | undefined,
              });
            }}
            tabs={[
              { label: 'ทั้งหมด', value: '' },
              { label: 'รอตรวจสอบ', value: BugReportStatus.WAITING },
              { label: 'กำลังแก้ไข', value: BugReportStatus.EDITING },
              { label: 'แก้ไขสำเร็จ', value: BugReportStatus.SUCCESS },
              { label: 'ปิดงาน', value: BugReportStatus.CLOSING },
            ]}
          />
        </div>

        <div className="mt-5 w-full">
          <DataTable
            className="table-hover whitespace-nowrap"
            columns={columnDefs}
            records={paginatedRecords}
            totalRecords={pagination.total_count}
            recordsPerPage={pagination.limit}
            page={pagination.page}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            onRecordsPerPageChange={(limit) => {
              setPagination((prev) => ({ ...prev, limit, page: 1 }));
            }}
            recordsPerPageOptions={pageSizeOptions}
            paginationText={({ from, to, totalRecords }) =>
              `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
            }
            fetching={fetching}
            defaultColumnRender={(row, _, accessor) => {
              const key = accessor as keyof IBugReportProps;
              return key in row
                ? row[key] != null || row[key] != undefined
                  ? row[key]
                  : '-'
                : '-';
            }}
          />
        </div>
      </CWWhiteBox>
    </div>
  );
};

export default DomainJSX;
