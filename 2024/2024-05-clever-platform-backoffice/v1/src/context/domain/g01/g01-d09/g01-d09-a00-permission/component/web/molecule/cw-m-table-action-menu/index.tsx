import CWInputSearch from '@component/web/cw-input-search';
import ButtonBulkEdit from '@context/domain/g01/g01-d09/local/component/web/atom/cw-a-button-bulk-edit';
import ButtonAddPermission from '../../atom/cw-a-button-add-permission';
import { TAdminReportPermission } from '@domain/g01/g01-d09/local/api/helper/admin-report-permission';
import { EAdminReportPermissionStatus } from '@domain/g01/g01-d09/local/enums/admin-permission';
import API from '@domain/g01/g01-d09/local/api';
import showMessage from '@global/utils/showMessage';

type TableActionMenuProps = {
  searchText: string;
  handleSetSearchText: (value: string) => void;
  selectedRecords: TAdminReportPermission[];
  onUpdateRecords?: (items: TAdminReportPermission[]) => void;
  handleRefetchData?: () => void;
};

const TableActionMenu = ({
  searchText,
  handleSetSearchText,
  selectedRecords,
  onUpdateRecords,
  handleRefetchData,
}: TableActionMenuProps) => {
  const handleArchive = async (
    lists: TAdminReportPermission[],
    status: EAdminReportPermissionStatus.DISABLE | EAdminReportPermissionStatus.ENABLE,
  ) => {
    try {
      await API.adminReportPermissionAPI.BulkEditAdminReportPermission(
        lists.map((item) => ({
          observer_access_id: item.id,
          status: status,
        })),
      );
    } catch (error) {
      showMessage('อัปเดตรายการล้มแหลว', 'error');
      throw error;
    }

    showMessage('อัปเดตรายการสำเร็จ');
    handleRefetchData?.();
    onUpdateRecords?.([]);
  };

  return (
    <div className="mb-6 flex flex-row gap-2">
      <ButtonBulkEdit
        handleArchive={() =>
          handleArchive(selectedRecords, EAdminReportPermissionStatus.DISABLE)
        }
        handleArchiveRecall={() =>
          handleArchive(selectedRecords, EAdminReportPermissionStatus.ENABLE)
        }
        selectedRecords={selectedRecords}
      />
      <ButtonAddPermission />
      <div className="h-10 w-px bg-gray-300"></div>
      <CWInputSearch
        placeholder={'ค้นหา'}
        value={searchText}
        onChange={(e) => handleSetSearchText(e.target.value)}
      />
    </div>
  );
};
export default TableActionMenu;
