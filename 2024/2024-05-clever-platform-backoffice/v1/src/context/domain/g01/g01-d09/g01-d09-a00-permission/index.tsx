import { useEffect, useState } from 'react';
import API from '../local/api';
import { TAdminReportPermission } from '../local/api/helper/admin-report-permission';
import dayjs from '@global/utils/dayjs';
import 'dayjs/locale/th';
import 'dayjs/locale/en';
import { TPagination } from '../local/types/pagination';
import { EAdminReportPermissionStatus } from '../local/enums/admin-permission';
import ReportPermissionTemplate from './component/web/template/cw-t-report-permission-template';
import ReportPermissionHeader from '../local/component/web/molecule/cw-m-report-permission-header';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { pagination, setPagination } = usePagination();
  const [fetching, setFetching] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [records, setRecords] = useState<TAdminReportPermission[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<
    EAdminReportPermissionStatus | undefined
  >(undefined);
  const [selectedAccessName, setSelectedAccessName] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const abortController = new AbortController();
    handleGetRecord(pagination, abortController);

    return () => {
      abortController.abort();
    };
  }, [pagination.page, pagination.limit, searchText, selectedFilter, selectedAccessName]);

  // * This need to show thai language when using dayjs().format().
  // ? Need better way when find some!
  dayjs.locale('th');
  useEffect(() => {
    return () => {
      dayjs.locale('en');
    };
  }, []);

  const handleGetRecord = async (
    pagination: TPagination,
    abortController?: AbortController,
  ) => {
    const name = searchText.trim();

    setFetching(true);
    try {
      const record = await API.adminReportPermissionAPI.GetsAdminReportPermission(
        {
          ...pagination,
          name: name || undefined,
          status: selectedFilter,
          access_name: selectedAccessName ? selectedAccessName : undefined,
        },
        abortController,
      );

      setPagination((prev) => ({ ...prev, total_count: record._pagination.total_count }));
      setRecords(record.data);
    } finally {
      setFetching(false);
    }
  };

  const handleRowSelect = (selectedRows: TAdminReportPermission) => {
    console.log('Selected rows:', selectedRows);
  };

  return (
    <div className="flex flex-col gap-[25px]">
      <ReportPermissionHeader />
      <ReportPermissionTemplate
        fetching={fetching}
        handleSelectStatusFilter={(value) => setSelectedFilter(value)}
        handleTabAccessNameChange={(value) => setSelectedAccessName(value)}
        onPaginationChange={setPagination}
        onSearchTextChange={setSearchText}
        onRowSelect={handleRowSelect}
        pagination={pagination}
        records={records}
        searchText={searchText}
        handleRefetchData={() => handleGetRecord(pagination)}
        selectedAccessName={selectedAccessName}
      />
    </div>
  );
};

export default DomainJSX;
