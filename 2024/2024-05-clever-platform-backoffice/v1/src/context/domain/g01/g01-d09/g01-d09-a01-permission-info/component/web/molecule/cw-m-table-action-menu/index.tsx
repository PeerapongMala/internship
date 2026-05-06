import CWInputSearch from '@component/web/cw-input-search';
import ButtonBulkEdit from '@context/domain/g01/g01-d09/local/component/web/atom/cw-a-button-bulk-edit';
import ButtonAddSchool from '../../atom/cw-a-button-add-school';
import { TObServerAccessSchool } from '@domain/g01/g01-d09/local/api/helper/admin-report-permission';
import API from '@domain/g01/g01-d09/local/api';
import useStore from '@domain/g01/g01-d09/local/stores';
import showMessage from '@global/utils/showMessage';
import WCAInputDropdown from '@component/web/atom/wc-a-input-dropdown.tsx';

type TableActionMenuProps = {
  searchText: { key: string; value: string };
  handleSetSearchText: (search: { key: string; value: string }) => void;
  selectedRecords: TObServerAccessSchool[];
  handleOpenModal?: () => void;
  onDeleteBulkEdit?: () => void;
};

const TableActionMenu = ({
  searchText,
  selectedRecords,
  handleSetSearchText,
  handleOpenModal,
  onDeleteBulkEdit,
}: TableActionMenuProps) => {
  const obsFormStore = useStore.observerAccessForm();
  const obsSchoolStore = useStore.observerAccessSchool();

  const handleRemoveSchool = async () => {
    try {
      if (!obsFormStore.formData.id) {
        throw new Error('must have observerAccessId');
      }

      await API.adminReportPermissionAPI.DeletesArpDeleteSchool(
        obsFormStore.formData.id,
        selectedRecords.map((record) => record.id),
      );
    } catch (error) {
      throw error;
    }
    onDeleteBulkEdit?.();
    obsSchoolStore.fetchData(obsFormStore.formData.id);

    showMessage('success');
  };
  const searchDropdownOptions = [
    { label: 'รหัสย่อโรงเรียน', value: 'code' },
    { label: 'ชื่อโรงเรียน', value: 'name' },
    { label: 'สังกัด', value: 'school_affiliation' },
  ];
  const dropdownPlaceholder =
    searchDropdownOptions && searchDropdownOptions.length > 0
      ? searchDropdownOptions[0].label
      : 'ฟิลด์';
  return (
    <div className="mb-6 flex flex-row gap-2">
      <ButtonBulkEdit
        disabled={selectedRecords.length === 0}
        disabledArchiveRecall
        customArchiveLabel="เอาออก"
        handleArchive={() => {
          handleRemoveSchool();
        }}
        selectedRecords={selectedRecords}
      />
      <ButtonAddSchool onClick={handleOpenModal} />
      <div className="h-10 w-px bg-gray-300"></div>
      {/* <CWInputSearch
        placeholder={'ค้นหา'}
        value={searchText}
        onChange={(e) => handleSetSearchText(e.target.value)}
      /> */}
      <div>
        <WCAInputDropdown
          inputPlaceholder="ค้นหา..."
          inputValue={searchText.value || ''}
          onInputChange={(e) => {
            handleSetSearchText({
              ...searchText,
              value: e.target.value,
            });
          }}
          dropdownOptions={searchDropdownOptions}
          dropdownPlaceholder={dropdownPlaceholder}
          dropdownValue={searchText.key || searchDropdownOptions[0]?.value}
          onDropdownSelect={(value) => {
            handleSetSearchText({
              ...searchText,
              key: `${value}`,
            });
          }}
        />
      </div>
    </div>
  );
};
export default TableActionMenu;
