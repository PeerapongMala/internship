import CWButton from '@component/web/cw-button';
import CWWhiteBox from '@component/web/cw-white-box';
import IconTask from '@core/design-system/library/component/icon/IconTask';
import API from '@domain/g06/local/api';
import { EStatus } from '@global/enums';
import showMessage from '@global/utils/showMessage';
import { useNavigate } from '@tanstack/react-router';

type PublishPanelProps = {
  id: number;
};

const PublishPanel = ({ id }: PublishPanelProps) => {
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      await API.SubjectTemplate.PostSubjectTemplateUpdate(id, {
        status: EStatus.ENABLED,
      });

      navigate({ to: '../..' });
      showMessage('เผยแพร่สำเร็จ');
    } catch (error) {
      showMessage('พบปัญหาในการเผยแพร่', 'error');
      throw error;
    }
  };

  return (
    <CWWhiteBox className="flex flex-col items-center gap-6">
      <div className="w-full border-b-[1px] border-neutral-200 pb-5 text-center">
        <span className="text-3xl font-bold">ตรวจสอบความเรียบร้อย</span>
      </div>

      <div className="text-center">
        กรุณาตรวจสอบก่อนเผยแพร่ข้อมูล หลังจากที่เผยแพร่ข้อมูลแล้ว <br />
        คุณจะ<span className="underline">ไม่สามารถ</span>แก้ไขข้อมูล template ใบตัดเกรดได้
      </div>

      <CWButton
        className="w-32"
        title="เผยแพร่"
        variant="danger"
        icon={<IconTask />}
        onClick={handleSave}
      />
    </CWWhiteBox>
  );
};

export default PublishPanel;
