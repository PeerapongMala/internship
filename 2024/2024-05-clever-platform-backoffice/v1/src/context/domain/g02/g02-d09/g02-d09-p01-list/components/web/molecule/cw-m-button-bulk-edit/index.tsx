import CWMDropdown from '@component/web/molecule/cw-m-dropdown';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import showMessage from '@global/utils/showMessage';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown } from 'react-icons/io';
import API from '@domain/g06/local/api';
import { EStatus } from '@global/enums';

type ButtonBulkEditProps = {
  className?: string;
  updateItemIDLists: number[];
  onSuccess?: () => void;
  disabled?: boolean;
};

const ButtonBulkEdit = ({
  className,
  updateItemIDLists,
  onSuccess,
  disabled,
}: ButtonBulkEditProps) => {
  const { t } = useTranslation(['global']);

  const handleArchive = async (lists: number[], isArchived: boolean) => {
    const oprType = isArchived ? 'จัดเก็บ' : 'เรียกคืน';

    const payload = lists.map((id) => ({
      id: id,
      status: isArchived ? EStatus.DISABLED : EStatus.ENABLED,
    }));

    try {
      await API.SubjectTemplate.PostSubjectTemplateBulkEdit({ bulk_edit_list: payload });
    } catch (error) {
      showMessage(`พบปัญหาในการ${oprType}รายการ`, 'error');
      throw error;
    }
    onSuccess?.();
    showMessage(`${oprType}รายการสำเร็จ`);
  };

  return (
    <CWMDropdown
      disabled={disabled}
      className={className}
      label={
        <>
          <span>{t('button.bulkEdit')}</span>
          <IoIosArrowDown className="h-5 w-5" />
        </>
      }
      items={[
        {
          label: (
            <div className="flex gap-3">
              <IconArchive /> จัดเก็บ
            </div>
          ),
          onClick: () => {
            handleArchive(updateItemIDLists, true);
          },
        },
        {
          label: (
            <div className="flex gap-3">
              <IconCornerUpLeft className="h-5 w-5" /> เรียกคืน
            </div>
          ),
          onClick: () => {
            handleArchive(updateItemIDLists, false);
          },
        },
      ]}
    />
  );
};

export default ButtonBulkEdit;
