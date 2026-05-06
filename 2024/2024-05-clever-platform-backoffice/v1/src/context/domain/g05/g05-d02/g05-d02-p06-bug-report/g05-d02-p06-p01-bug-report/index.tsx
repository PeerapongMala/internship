import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import CWButton from '@component/web/cw-button';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { useEffect, useMemo, useState } from 'react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { TPagination } from '../../local/types';
import Pagination from '@core/design-system/library/component/web/Pagination';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import API from '../../local/api';
import showMessage from '@global/utils/showMessage';
import { TBugReport } from '../../local/types/bug-report';
import StoreGlobal from '@store/global';
import CWPagination from '@component/web/cw-pagination';

import usePagination from '@global/hooks/usePagination';

const DomainJsx = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);
      setIsMobile(false);
      if (!isMobile) {
        StoreGlobal.MethodGet().TemplateSet(false);
        StoreGlobal.MethodGet().BannerSet(false);
        setIsMobile(true);
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);
  const goCreate = () => {
    navigate({ to: './create' });
  };
  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<TBugReport[]>([]);
  const { pagination, setPagination } = usePagination();

  useEffect(() => {
    fetchData();
  }, [pagination.page]);
  const fetchData = async () => {
    setFetching(true);
    try {
      setFetching(true);
      const res = await API.BugReport.BugList({
        page: pagination?.page,
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
    ];

    return finalDefs;
  }, []);

  const totalPages = Math.ceil(pagination.total_count / pagination.limit);

  return (
    <ScreenTemplate
      className="mb-20 items-center"
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
            <DataTable
              fetching={fetching}
              className="table-hover whitespace-nowrap"
              columns={columnDefs}
              records={records}
              minHeight={200}
              noRecordsText="ไม่พบข้อมูล"
              noHeader={isMobile}
              loaderType="oval"
              loaderBackgroundBlur={4}
            />
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
            <FooterMenu />
          </div>
        </div>
      </div>
    </ScreenTemplate>
  );
};

export default DomainJsx;
