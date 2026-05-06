import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { useNavigate } from '@tanstack/react-router';
import { UserAccountResponse } from '../../../../local/type';
import { TabType } from '../../../constants';

interface TableHeaderProps {
  selectedRecords: any[];
  selectedTab: TabType;
  onBulkEdit: (
    records: UserAccountResponse[],
    status: 'enabled' | 'disabled' | 'draft',
  ) => Promise<void>;
  onDownloadCSV: (data: Record<string, any>) => Promise<void>;
  onUploadCSV: (file?: File) => Promise<void>;
  navigate: ReturnType<typeof useNavigate>;
  setSearchField: (value: string | number) => void;
  setSearchValue: (value: string) => void;
}

export const TableHeader = ({
  selectedRecords,
  selectedTab,
  onBulkEdit,
  onDownloadCSV,
  onUploadCSV,
  navigate,
  setSearchField,
  setSearchValue,
}: TableHeaderProps) => {
  const getBtnLabel = () => {
    switch (selectedTab) {
      case 'admin':
        return 'เพิ่มผู้ดูแล';
      case 'parent':
        return null;
      case 'observer':
        return 'เพิ่มผู้สังเกตการณ์';
      case 'content-creator':
        return 'เพิ่มนักวิชาการ';
      default:
        return '';
    }
  };

  const btnLabel = getBtnLabel();

  const searchDropdownOptions = [
    { label: 'รหัส', value: 'id' },
    { label: 'คำนำหน้า', value: 'title' },
    { label: 'ชื่อ', value: 'first_name' },
    { label: 'นามสกุล', value: 'last_name' },
    { label: 'อีเมล', value: 'email' },
  ];

  return (
    <CWOHeaderTableButton
      bulkEditDisabled={selectedRecords.length === 0}
      bulkEditActions={[
        {
          label: (
            <div className="flex gap-2">
              <IconPlus />
              <div>เปิดใช้งาน</div>
            </div>
          ),
          onClick: () => onBulkEdit(selectedRecords, 'enabled'),
        },
        {
          label: (
            <div className="flex gap-2">
              <IconArchive />
              <div>ปิดใช้งาน</div>
            </div>
          ),
          onClick: () => onBulkEdit(selectedRecords, 'disabled'),
        },
      ]}
      onBtnClick={(): void => {
        let path = '/create';
        switch (selectedTab) {
          case 'parent':
            path = '/parent/create';
            break;
          case 'observer':
            path = '/observer/create';
            break;
          case 'content-creator':
            path = '/content-creator/create';
            break;
        }
        navigate({ to: `${location.pathname}${path}` });
      }}
      btnIcon={<IconPlus />}
      searchDropdownOptions={searchDropdownOptions}
      onSearchDropdownSelect={setSearchField}
      onSearchChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setSearchValue(e.target.value)
      }
      inputSearchType="input-dropdown"
      btnLabel={btnLabel || ''}
      onDownload={onDownloadCSV}
      onUpload={onUploadCSV}
    />
  );
};
