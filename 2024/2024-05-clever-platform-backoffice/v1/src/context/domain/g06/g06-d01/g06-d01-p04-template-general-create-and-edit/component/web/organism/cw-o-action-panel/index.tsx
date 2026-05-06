import CWButton from '@component/web/cw-button';
import CWSelect from '@component/web/cw-select';
import CWWhiteBox from '@component/web/cw-white-box';
import { EStatusTemplate, GeneralTemplates } from '@domain/g06/g06-d01/local/api/type';
import dayjs from '@global/utils/dayjs';
import 'dayjs/locale/th';
import { useMemo } from 'react';

type ActionPanelProps = {
  className?: string;
  template: Partial<GeneralTemplates>;
  onStatusChange?: (status: EStatusTemplate) => void;
};

const ActionPanel = ({ template, className, onStatusChange }: ActionPanelProps) => {
  const updatedAt = useMemo(() => {
    const date = template.updated_at ?? template.created_at;
    if (!date) return '-';

    return dayjs(date).locale('th').format('DD MMM BBBB HH:mm');
  }, [template.created_at, template.updated_by]);

  return (
    <div className={className}>
      <CWWhiteBox className="grid grid-rows-5 gap-1">
        <div className="grid grid-cols-2 items-center">
          <h1>รหัส Template:</h1>
          <h1>{template.id ?? '-'}</h1>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h1>สถานะ:</h1>
          <CWSelect
            required
            value={template.status}
            options={[
              {
                label: 'ใช้งาน',
                value: EStatusTemplate.published,
              },
              {
                label: 'แบบร่าง',
                value: EStatusTemplate.draft,
              },
              {
                label: 'ไม่ใช้งาน',
                value: EStatusTemplate.cancel,
              },
            ]}
            className="w-full"
            onChange={(e) => onStatusChange?.(e?.target?.value as EStatusTemplate)}
          />
        </div>
        <div className="grid grid-cols-2 items-center">
          <h1>แก้ไขล่าสุด:</h1>
          <h1>{updatedAt}</h1>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h1>แก้ไขล่าสุดโดย:</h1>
          <h1>{template.updated_by ?? '-'} </h1>
        </div>
        <div className="grid grid-cols-1 items-center">
          <CWButton type="submit" title={'บันทึก'} variant={'primary'} />
        </div>
      </CWWhiteBox>
    </div>
  );
};

export default ActionPanel;
