import CWSelect from '@component/web/cw-select';
import { EAdminReportPermissionStatus } from '@domain/g01/g01-d09/local/enums/admin-permission';

type SelectAdminReportPermissionStatusProps = {
  value?: EAdminReportPermissionStatus;
  onChange: (value: EAdminReportPermissionStatus) => void;
};

const SelectAdminReportPermissionStatus = ({
  onChange,
  value,
}: SelectAdminReportPermissionStatusProps) => {
  return (
    <CWSelect
      required
      className="w-full max-w-[265px]"
      value={value}
      options={[
        { label: 'ใช้งาน', value: EAdminReportPermissionStatus.ENABLE },
        { label: 'แบบร่าง', value: EAdminReportPermissionStatus.DRAFT },
        { label: 'ไม่ใช้งาน', value: EAdminReportPermissionStatus.DISABLE },
      ]}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        onChange?.(e.target.value as EAdminReportPermissionStatus)
      }
    />
  );
};

export default SelectAdminReportPermissionStatus;
