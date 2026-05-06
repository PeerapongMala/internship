import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';
import { Link, useNavigate, useParams } from '@tanstack/react-router';

import CWButton from '@component/web/cw-button';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { useEffect, useMemo, useState } from 'react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { TPagination } from '../local/types';
import Pagination from '@core/design-system/library/component/web/Pagination';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import { TBugReport } from '../local/types/bug-report';
import StoreGlobal from '@store/global';
import CWPagination from '@component/web/cw-pagination';
import FooterMenu from '@domain/g05/g05-d01/local/component/web/organism/cw-o-footer-menu';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import StoreGlobalPersist from '@store/global/persist';
import usePagination from '@global/hooks/usePagination';

const DomainJsx = () => {
  const navigate = useNavigate();
  const goCreate = () => {
    navigate({ to: './create' });
  };
  const { userData }: { userData: IUserData } = StoreGlobalPersist.StateGet(['userData']);
  console.log({ role: userData?.roles[0] });
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const updateLayout = () => {
      const isMobileView = window.innerWidth <= 768;
      const currentPath = window.location.pathname;
      const userRole = userData?.roles?.[0];

      StoreGlobal.MethodGet().TemplateSet(!isMobileView);
      StoreGlobal.MethodGet().BannerSet(!isMobileView);
      setIsMobile(isMobileView);

      if (isMobileView && currentPath !== '/line/teacher/chat') {
        if (userRole === 1 || userRole === 2) {
          StoreGlobal.MethodGet().TemplateSet(true);
          StoreGlobal.MethodGet().BannerSet(true);
          return;
        }

        navigate({ to: '/line/teacher/bug-report' });
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate, userData?.roles]);

  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<TBugReport[]>([]);
  const { pagination, setPagination } = usePagination();

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit]);
  const fetchData = async () => {
    setFetching(true);
    try {
      setFetching(true);
      const res = await API.BugReport.BugList({
        page: pagination?.page,
        limit: pagination?.limit,
      });
      if (res?.status_code === 200) {
        setRecords(res?.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res?._pagination?.total_count || res?.data?.length,
        }));
      }
    } catch (error: any) {
      console.error('Fetch error', error);
      showMessage(error, 'error');
    } finally {
      setFetching(false);
    }
  };

  const columnDefs = useMemo<DataTableColumn<TBugReport>[]>(() => {
    const finalDefs: DataTableColumn<TBugReport>[] = [
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'bug_id', title: 'รหัส' },
      {
        accessor: 'description',
        title: 'รายละเอียดปัญหา',
        render: (record) => (
          <div title={record.description}>
            {record?.description.length > 10
              ? `${record?.description.substring(0, 10)}...`
              : record?.description}
          </div>
        ),
      },
      {
        accessor: 'view',
        title: 'ดู',
        textAlign: 'center',
        render: ({ bug_id }) => (
          <Link
            to="./$bugId/view"
            params={{ bugId: bug_id }}
            className="flex justify-end md:justify-center"
          >
            <IconEye />
          </Link>
        ),
      },
    ];

    return finalDefs;
  }, []);

  const totalPages = Math.ceil(pagination.total_count / pagination.limit);

  return (
    <ScreenTemplate
      className="items-center"
      headerTitle="ปัญหาการใช้งาน"
      header={false}
      bg_white={isMobile}
      footer={isMobile}
    >
      <div className="flex w-full flex-col items-center">
        <div className="mt-5 flex w-full items-center justify-center md:justify-start">
          <p className="text-2xl font-bold">ปัญหาการใช้งาน</p>
        </div>
        <div className={`mt-5 w-full rounded-md md:p-5 ${isMobile ? '' : 'bg-white'}`}>
          <div className={`flex w-full ${isMobile ? 'justify-center' : 'justify-start'}`}>
            <CWButton title="แจ้งปัญหาการใช้งาน" icon={<IconPlus />} onClick={goCreate} />
          </div>
          <div className="mt-5 w-full">
            {records.length > 0 ? (
              <DataTable
                fetching={fetching}
                className="table-hover whitespace-nowrap"
                columns={columnDefs}
                records={records}
                minHeight={200}
                noHeader={isMobile}
                loaderType="oval"
                loaderBackgroundBlur={4}
              />
            ) : (
              <DataTable
                fetching={fetching}
                className="table-hover whitespace-nowrap"
                columns={columnDefs}
                records={[]}
                minHeight={200}
                noHeader={isMobile}
                noRecordsText="ไม่พบข้อมูล"
                withTableBorder
                withColumnBorders
                loaderType="oval"
                loaderBackgroundBlur={4}
              />
            )}
          </div>

          <div className="mb-5 mt-4 flex w-full justify-center">
            {records?.length > 0 && (
              <CWPagination
                currentPage={pagination.page}
                onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                pageSize={pagination.limit}
                setPageSize={(size) =>
                  setPagination((prev) => ({ ...prev, limit: size }))
                }
                totalPages={totalPages}
              />
            )}
          </div>

          <div className="mt-4 flex w-full justify-center">
            {userData?.roles?.[0] != 1 && <FooterMenu />}
          </div>
        </div>
      </div>
    </ScreenTemplate>
  );
};

export default DomainJsx;
