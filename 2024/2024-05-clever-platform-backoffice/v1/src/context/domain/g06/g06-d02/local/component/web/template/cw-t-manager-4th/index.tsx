import CWButton from '@component/web/cw-button';
import CWWhiteBox from '@component/web/cw-white-box';
import IconTask from '@core/design-system/library/component/icon/IconTask';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';

type TemplateManagerForthPageProps = {
  hidden?: boolean;
  handleSubmit?: () => Promise<void>;
};

const TemplateManagerForthPage = ({ hidden }: TemplateManagerForthPageProps) => {
  return (
    <CWWhiteBox
      className={cn(
        'flex w-full flex-col items-center gap-6 p-4',
        hidden ? 'hidden' : hidden,
      )}
    >
      <span className="text-4xl font-bold">ตรวจสอบความเรียบร้อย</span>

      <div className="h-[1px] w-full border-b border-b-neutral-200"></div>

      <span className="max-w-[455px] text-center text-lg">
        กรุณาตรวจสอบก่อนเผยแพร่ข้อมูลหลังจากที่เผยแพร่ข้อมูลแล้ว คุณจะไม่สามารถแก้ไขข้อมูล
        Template ในตัดเกรดได้
      </span>

      <CWButton type="submit" icon={<IconTask />} variant="danger" title="เผยแพร่" />
    </CWWhiteBox>
  );
};

export default TemplateManagerForthPage;
