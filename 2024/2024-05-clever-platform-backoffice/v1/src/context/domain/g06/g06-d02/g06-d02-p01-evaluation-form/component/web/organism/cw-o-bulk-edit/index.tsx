import CWMDropdown from '@component/web/molecule/cw-m-dropdown';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import API from '@domain/g06/g06-d02/local/api';
import { EEvaluationFormStatus } from '@domain/g06/g06-d02/local/enums/evaluation';
import { TEvaluationForm } from '@domain/g06/g06-d02/local/types/grade';
import showMessage from '@global/utils/showMessage';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown } from 'react-icons/io';

type BulkEditOrganismProps = {
  className?: string;
  updateItemIDLists: number[];
  onSuccess?: () => void;
  disabled?: boolean;
};

const BulkEditOrganism = ({
  className,
  updateItemIDLists,
  onSuccess,
  disabled,
}: BulkEditOrganismProps) => {
  const { t } = useTranslation(['global']);

  const handleArchive = async (lists: number[], isArchived: boolean) => {
    const oprType = isArchived ? 'เรียกคืน' : 'จัดเก็บ';

    const payload = lists.map((id) => {
      const item: Partial<TEvaluationForm> & { id: number } = {
        id: id,
        is_archived: isArchived,
      };
      return item;
    });

    try {
      await API.Grade.PatchBulkEvaluationForm(payload);
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

export default BulkEditOrganism;
