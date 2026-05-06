import { useEffect, useState, useMemo, SetStateAction, useRef } from 'react';
import {
  Curriculum,
  FilterSubject,
  IDownloadCsv,
  Pagination,
  RewardTeacher,
  Status,
  StatusReward,
  TeacherReward,
} from '../local/type';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { toDateTimeTH } from '@global/utils/date';

import { Link, useNavigate } from '@tanstack/react-router';
import { useDebouncedValue } from '@mantine/hooks';
import StoreGlobalPersist from '@store/global/persist';
import showMessage from '@global/utils/showMessage';
import Tabs from '@component/web/cw-tabs';
import API from '../local/api';
import CWMainLayout from '../local/components/web/template/cw-main-layout';
import { Redeem, StatusRedeem } from '../local/api/types/redeem';
import CWInputSearch from '@component/web/cw-input-search';
import { RedeemFilterQueryParams } from '../local/api/repository/redeem';
import CWButtonSwitch from '@component/web/cw-button-switch';
import CWWhiteBox from '@component/web/cw-white-box';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import StoreGlobal from '@store/global';
import usePagination from '@global/hooks/usePagination';
const DomainJSX = () => {
  const navigate = useNavigate();
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

  const { targetData, userData } = StoreGlobalPersist.StateGet([
    'targetData',
    'userData',
  ]) as {
    targetData: IUserData;
    userData: IUserData;
  };
  const academic_year = targetData?.academic_year ?? userData?.academic_year;
  // ### for line
  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth < 768;
      StoreGlobal.MethodGet().TemplateSet(!isMobile);
      StoreGlobal.MethodGet().BannerSet(!isMobile);

      // ถ้าต้องการ redirect ในกรณีเฉพาะ
      if (isMobile && window.location.pathname !== '/line/teacher/reward') {
        navigate({ to: '/line/teacher/reward' });
      }
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const [fetching, setFetching] = useState<boolean>(false);

  const [selectedRecords, setSelectedRecords] = useState<Redeem[]>([]);
  const [records, setRecords] = useState<Redeem[]>([]);

  const [filterSearch, setFilterSearch] = useState<RedeemFilterQueryParams>({
    search_text: '',
    status: undefined,
  });
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  useEffect(() => {
    fetchRedeem();
  }, [filterSearch, pagination.page, pagination.limit]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  }, [filterSearch]);

  const fetchRedeem = () => {
    if (!academic_year) {
      return;
    }
    setFetching(true);
    API.redeem
      .GetsRedeem({
        page: pagination.page,
        limit: pagination.limit,
        academic_year: academic_year,
        ...filterSearch,
      })
      .then((res) => {
        if (res.status_code === 200) {
          setRecords(res.data);
          setPagination((prev) => ({
            ...prev,
            total_count: res?._pagination?.total_count || res?.data?.length,
          }));
        } else {
          showMessage(res.message, 'error');
        }
      })
      .catch((error: any) => {
        showMessage(`เกิดข้อผิดพลาดในการดึงข้อมูล ${error}`, 'error');
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      setFetching(true);
      // Determine new status based on current switch state
      // If switch is being turned ON (currentStatus = true), set status to SENT
      // If switch is being turned OFF (currentStatus = false), set status to PENDING
      const newStatus = currentStatus ? StatusRedeem.SENT : StatusRedeem.PENDING;

      await API.redeem.ToggleStatus(id, newStatus);

      await fetchRedeem();

      showMessage('อัพเดทสถานะเรียบร้อยแล้ว', 'success');
    } catch (error) {
      console.error('Failed to toggle status:', error);
      showMessage('ไม่สามารถเปลี่ยนสถานะได้', 'error');
      // Refresh data to revert any UI changes if API failed
      await fetchRedeem();
    } finally {
      setFetching(false);
    }
  };

  const columnDefs = useMemo<DataTableColumn<Redeem>[]>(() => {
    const finalDefs: DataTableColumn<Redeem>[] = [
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'id', title: 'รหัสรางวัล' },
      { accessor: 'reward_name', title: 'ชื่อรางวัล' },
      {
        accessor: 'student_used',
        title: 'ผู้ใช้รางวัล',
        render: ({ title, first_name, last_name }) => {
          return (
            <div className="flex gap-2">
              <div className="flex">
                <p>{title}</p>
                <p>{first_name}</p>
              </div>
              <p>{last_name}</p>
            </div>
          );
        },
      },
      {
        accessor: 'year',
        title: 'ชั้นปี',
        render: ({ year, class_room }) => {
          return (
            <div className="flex">
              <p>
                {year}/{class_room}
              </p>
            </div>
          );
        },
      },
      {
        accessor: 'created_at',
        title: 'วันที่ใช้รางวัล',
        render: ({ created_at }) => {
          return created_at ? toDateTimeTH(created_at) : '-';
        },
      },
      {
        accessor: 'status',
        title: 'สถานะรางวัล',
        render: ({ status }) => {
          if (status === StatusRedeem.PENDING)
            return <span className="badge badge-outline-warning">รอการให้</span>;
          else if (status === StatusRedeem.SENT)
            return <span className="badge badge-outline-info">ให้รางวัลแล้ว</span>;
        },
      },
      {
        accessor: 'is_enabled',
        title: 'ให้รางวัล',
        render: ({ id, status }) => (
          <CWButtonSwitch
            initialState={status === StatusRedeem.SENT}
            onChange={(isOn) => handleToggleStatus(id, isOn)}
            disabled={fetching}
          />
        ),
      },
    ];

    return finalDefs;
  }, [filterSearch]);

  const handleSelectionChange = (selectedRows: SetStateAction<Redeem[]>) => {
    setSelectedRecords(selectedRows);
  };

  return (
    <div className="w-full">
      <CWMainLayout
        title={`จัดการรางวัล ปีการศึกษา ${academic_year}`}
        breadcrumbItems={[
          { label: 'การเรียนการสอน', href: '/', disabled: true },
          { label: 'จัดการรางวัล' },
        ]}
      >
        <CWWhiteBox>
          <div className="flex">
            <CWInputSearch
              onClick={fetchRedeem}
              placeholder="ค้นหา"
              value={filterSearch.search_text}
              onChange={(e) =>
                setFilterSearch((prev) => ({ ...prev, search_text: e.target.value }))
              }
              className="w-[200px]"
            />
          </div>

          <div className="mt-5 w-full">
            <Tabs
              currentTab={filterSearch.status}
              setCurrentTab={(value) => {
                setFilterSearch((prev) => ({
                  ...prev,
                  status: value as StatusRedeem,
                }));
              }}
              tabs={[
                { label: 'ทั้งหมด', value: undefined },
                { label: 'รอการให้', value: StatusRedeem.PENDING },
                { label: 'ให้รางวัลแล้ว', value: StatusRedeem.SENT },
              ]}
            />
            <div className="mt-5 w-full">
              {(records ?? []).length > 0 ? (
                <DataTable
                  height={'calc(100vh - 350px)'}
                  className="table-hover whitespace-nowrap"
                  columns={columnDefs}
                  records={records ?? []}
                  minHeight={200}
                  totalRecords={pagination.total_count}
                  recordsPerPage={pagination.limit}
                  page={pagination.page}
                  onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                  onRecordsPerPageChange={(limit) =>
                    setPagination((prev) => ({ ...prev, limit, page: 1 }))
                  }
                  recordsPerPageOptions={pageSizeOptions}
                  paginationText={({ from, to, totalRecords }) =>
                    `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
                  }
                  fetching={fetching}
                  loaderType="oval"
                  loaderBackgroundBlur={4}
                />
              ) : (
                <DataTable
                  height={'calc(100vh - 350px)'}
                  className="table-hover whitespace-nowrap"
                  columns={columnDefs}
                  records={[]}
                  minHeight={200}
                  noRecordsText="ไม่พบข้อมูล"
                  fetching={fetching}
                  withTableBorder
                  withColumnBorders
                  loaderType="oval"
                  loaderBackgroundBlur={4}
                />
              )}
            </div>
          </div>
        </CWWhiteBox>
      </CWMainLayout>
    </div>
  );
};

export default DomainJSX;
