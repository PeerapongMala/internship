import CWButton from '@component/web/cw-button';
import CWWhiteBox from '@component/web/cw-white-box';
import { toDateTH } from '@global/utils/date';
import dayjs from 'dayjs';

interface SavePanelProp {
  mode?: 'create' | 'view';
  onSave?: () => void;
  lastUpdated?: string;
  lastUpdatedBy?: string;
  problemId?: string;
  status?: 'pending' | 'in-progress' | 'resolved' | 'closed' | string;
}
const SavePanel = ({
  mode = 'view',
  onSave,
  lastUpdated,
  lastUpdatedBy,
  problemId,
  status = 'pending',
}: SavePanelProp) => {
  const translateStatus = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'รอตรวจสอบ';
      case 'in-progress':
        return 'กำลังแก้ไข';
      case 'resolved':
        return 'แก้ไขสำเร็จ';
      case 'closed':
        return 'ปิดงาน';
      default:
        return status;
    }
  };

  return (
    <CWWhiteBox className="w-full">
      <div className="flex w-full flex-col">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '150px 1fr',
            marginBottom: '20px',
          }}
        >
          <p>รหัสปัญหา:</p>
          <span>{problemId ?? '-'}</span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '150px 1fr',
            marginBottom: '20px',
          }}
        >
          <p>สถานะ:</p>
          <span>{translateStatus(status)}</span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '150px 1fr',
            marginBottom: '20px',
          }}
        >
          <p>แก้ไขล่าสุด:</p>
          <span>{lastUpdated ? toDateTH(lastUpdated) : '-'}</span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '150px 1fr',
            marginBottom: '20px',
          }}
        >
          <p>แก้ไขล่าสุดโดย:</p>
          <span>{lastUpdatedBy ? lastUpdatedBy : '-'}</span>
        </div>
        {mode === 'create' && (
          <CWButton variant={'primary'} title={'บันทึก'} onClick={onSave}>
            บันทึก
          </CWButton>
        )}
      </div>
    </CWWhiteBox>
  );
};

export default SavePanel;
