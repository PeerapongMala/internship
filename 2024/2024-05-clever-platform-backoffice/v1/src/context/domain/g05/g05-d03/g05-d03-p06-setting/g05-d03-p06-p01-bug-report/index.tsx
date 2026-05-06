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

import usePagination from '@global/hooks/usePagination';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';

const DomainJsx = () => {
  const navigate = useNavigate();
  const goCreate = () => {
    navigate({ to: './create' });
  };
  const goBack = () => {
    navigate({ to: '/line/student/clever/setting' });
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
        title: 'view',
        textAlign: 'right',
        render: ({ bug_id }) => (
          <Link
            to="./$bugId/view"
            params={{ bugId: bug_id }}
            className="flex justify-end"
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
        title: 'ปัญหา',
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
      className="mb-24 mt-5 items-center"
      headerTitle="ปัญหาการใช้งาน"
      header={false}
    >
      <div className="mb-5 w-full px-5">
        <div className="relative mb-5 flex items-center justify-center">
          <button onClick={goBack}>
            <IconArrowBackward className="absolute left-3 top-2" />
          </button>
          <p className="text-2xl font-bold">แจ้งปัญหาการใช้งาน</p>
        </div>
        <CWButton title="แจ้งปัญหาการใช้งาน" icon={<IconPlus />} onClick={goCreate} />
        <div className="mt-5 w-full">
          <DataTable
            fetching={fetching}
            className="table-hover whitespace-nowrap"
            columns={columnDefs}
            records={records}
            minHeight={200}
            noRecordsText="ไม่พบข้อมูล"
            noHeader
            loaderType="oval"
            loaderBackgroundBlur={4}
          />
        </div>
        <div className="mb-5 mt-4 flex w-full justify-center">
          {records?.length > 0 && (
            <Pagination
              currentPage={pagination.page}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
              pageSize={pagination.limit}
              setPageSize={(size) => setPagination((prev) => ({ ...prev, limit: size }))}
              totalPages={totalPages}
              disableDropdown={false}
            />
          )}
        </div>

        <div className="mt-4 flex w-full justify-center">
          <FooterMenu />
        </div>
      </div>
    </ScreenTemplate>
  );
};

export default DomainJsx;
