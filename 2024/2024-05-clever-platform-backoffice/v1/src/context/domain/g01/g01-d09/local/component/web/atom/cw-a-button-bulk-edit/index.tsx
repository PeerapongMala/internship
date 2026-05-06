import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import Dropdown from '@core/design-system/library/vristo/source/components/Buttons/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import {
  TAdminReportPermission,
  TObServerAccessSchool,
} from '@domain/g01/g01-d09/local/api/helper/admin-report-permission';

type ButtonBulkEditProps = {
  disabled?: boolean;
  disabledArchiveRecall?: boolean;
  customArchiveLabel?: string;
  handleArchive?: () => void;
  handleArchiveRecall?: () => void;
  selectedRecords?: TAdminReportPermission[] | TObServerAccessSchool[];
};

const ButtonBulkEdit = ({
  disabled,
  disabledArchiveRecall,
  customArchiveLabel,
  handleArchive,
  handleArchiveRecall,
  selectedRecords,
}: ButtonBulkEditProps) => {
  return (
    <div className="dropdown">
      <Dropdown
        disabled={selectedRecords?.length === 0}
        placement={'bottom-start'}
        btnClassName="btn btn-primary dropdown-toggle gap-1"
        button={
          <>
            Bulk Edit
            <IconCaretDown />
          </>
        }
      >
        <ul className="!min-w-[170px]">
          {!disabledArchiveRecall && (
            <li>
              <button
                type="button"
                className="w-full"
                onClick={() => handleArchiveRecall?.()}
              >
                <div className="flex w-full justify-between">
                  <span>เปิดใช้งาน</span>
                  <IconCornerUpLeft />
                </div>
              </button>
            </li>
          )}
          <li>
            <button type="button" className="w-full" onClick={() => handleArchive?.()}>
              <div className="flex w-full justify-between">
                <span>{customArchiveLabel ?? 'จัดเก็บ'}</span>
                <IconArchive />
              </div>
            </button>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
};

export default ButtonBulkEdit;
