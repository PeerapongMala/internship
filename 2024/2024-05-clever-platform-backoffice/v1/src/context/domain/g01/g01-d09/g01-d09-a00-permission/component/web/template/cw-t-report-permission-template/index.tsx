import React, { useEffect, useState } from 'react';
import AccessNameTab from '@domain/g01/g01-d09/g01-d09-a00-permission/component/web/organism/cw-o-table-access-name-tab';
import TableActionMenu from '@context/domain/g01/g01-d09/g01-d09-a00-permission/component/web/molecule/cw-m-table-action-menu';
import TableTypeFilterTab from '@context/domain/g01/g01-d09/g01-d09-a00-permission/component/web/organism/cw-o-table-type-filter-tab';
import DataTableWithPagination from '@context/domain/g01/g01-d09/g01-d09-a00-permission/component/web/organism/cw-o-table-data-with-pagination';
import { TAdminReportPermission } from '@context/domain/g01/g01-d09/local/api/helper/admin-report-permission';
import { TPagination } from '@context/domain/g01/g01-d09/local/types/pagination';
import CWWhiteBox from '@global/component/web/cw-white-box';
import { ADMINISTRATIVE_ROLES } from '@context/domain/g01/g01-d09/local/helpers/admin-report-permission';
import { EAdminReportPermissionStatus } from '@domain/g01/g01-d09/local/enums/admin-permission';

type ReportPermissionTemplateProps = {
  records: TAdminReportPermission[];
  pagination: TPagination;
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onPaginationChange: (pagination: TPagination) => void;
  handleSelectStatusFilter: (filter?: EAdminReportPermissionStatus) => void;
  handleTabAccessNameChange: (filter?: string) => void;
  selectedAccessName?: string;
  onRowSelect: (selectedRows: TAdminReportPermission) => void;
  handleRefetchData?: () => void;
  fetching?: boolean;
};

const ReportPermissionTemplate = ({
  records,
  pagination,
  searchText,
  onSearchTextChange,
  onPaginationChange,
  handleSelectStatusFilter,
  handleTabAccessNameChange,
  onRowSelect,
  handleRefetchData,
  selectedAccessName,
  fetching,
}: ReportPermissionTemplateProps) => {
  const [selectedRecords, setSelectedRecords] = useState<TAdminReportPermission[]>([]);

  return (
    <div className="flex flex-col gap-5">
      <AccessNameTab handleAccessNameChange={handleTabAccessNameChange} />
      <CWWhiteBox>
        <TableActionMenu
          searchText={searchText}
          handleSetSearchText={onSearchTextChange}
          selectedRecords={selectedRecords}
          onUpdateRecords={(records: TAdminReportPermission[]) =>
            setSelectedRecords(records)
          }
          handleRefetchData={handleRefetchData}
        />
        <TableTypeFilterTab handleOnFilterChange={handleSelectStatusFilter} />
        <DataTableWithPagination
          records={records}
          fetching={fetching}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          handleRowSelect={onRowSelect}
          handleRefetchData={handleRefetchData}
          selectedRecords={selectedRecords}
          onSelectRecordsChange={(items) => setSelectedRecords(items)}
          selectedAccessName={selectedAccessName}
        />
      </CWWhiteBox>
    </div>
  );
};

export default ReportPermissionTemplate;
