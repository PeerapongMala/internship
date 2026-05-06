import { TObserverAccesses } from '@domain/g01/g01-d09/local/helpers/admin-report-permission';
import SelectAdminReportPermissionStatus from '../../molecule/cw-m-select-admin-report-permission-status';
import { EAdminReportPermissionStatus } from '@domain/g01/g01-d09/local/enums/admin-permission';
import dayjs from '../../../../../../../../global/utils/dayjs';
import 'dayjs/locale/th';
import 'dayjs/locale/en';
import { useEffect, useState } from 'react';
import CWWhiteBox from '@component/web/cw-white-box';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import CWButton from '@component/web/cw-button';

type SaveEditAccessPanelProps = {
  className?: string;
  data: TObserverAccesses;
  onChange: (value: EAdminReportPermissionStatus) => void;
};

const SaveEditAccessPanel = ({ className, data, onChange }: SaveEditAccessPanelProps) => {
  dayjs.locale('th');
  useEffect(() => {
    return () => {
      dayjs.locale('en');
    };
  }, []);

  return (
    <CWWhiteBox className={cn('flex h-fit flex-col gap-4 p-4', className)}>
      <div className="flex gap-4">
        <span className="w-[123px]">รหัสสิทธิ์เข้าถึง</span>
        <span>{data.id ? String(data.id).padStart(5, '0') : '-'}</span>
      </div>
      <div className="flex gap-4">
        <span className="w-[123px]">สถานะ</span>
        <SelectAdminReportPermissionStatus value={data.status} onChange={onChange} />
      </div>
      <div className="flex gap-4">
        <span className="w-[123px]">แก้ไขล่าสุด</span>
        <span>
          {data.updatedAt ? dayjs(data.updatedAt).format('D MMM BBBB HH:mm') : '-'}
        </span>
      </div>
      <div className="flex gap-4">
        <span className="w-[123px]">แก้ไขล่าสุดโดย</span>
        <span>{data.updatedBy ?? '-'}</span>
      </div>
      <CWButton title="บันทึก" type="submit" />
    </CWWhiteBox>
  );
};

export default SaveEditAccessPanel;
