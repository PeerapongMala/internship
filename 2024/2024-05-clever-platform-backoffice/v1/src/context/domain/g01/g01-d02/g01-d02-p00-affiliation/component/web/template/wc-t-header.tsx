import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import Breadcrumbs from '@domain/g01/g01-d02/local/component/web/atom/wc-a-breadcrumbs';
import StoreGlobalPersist from '@store/global/persist';
import { useNavigate } from '@tanstack/react-router';

export default function AffiliationHeader() {
  const navigate = useNavigate();
  const { curriculumData } = StoreGlobalPersist.StateGet(['curriculumData']);

  const handleNavigateToCurriculum = () => {
    if (curriculumData === null) {
      navigate({ to: '/curriculum' });
    } else {
      navigate({ to: '/content-creator/course' });
    }
  };

  return (
    <div className="flex flex-col gap-y-6">
      <CWBreadcrumbs
        links={[
          { label: 'สำหรับแอดมิน', href: '/', disabled: true },
          { label: 'สังกัดโรงเรียน', href: '/' },
        ]}
      />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold leading-8">สังกัดโรงเรียน</h1>
        <p>
          สังกัดนี้จะใช้แกนหลักสูตรนี้เป็นค่าเริ่มต้น หากต้องการแก้ไขหลักสูตร
          กรุณาแก้ไขที่เมนู{' '}
          <span
            className="cursor-pointer text-[#4361EE] underline"
            onClick={handleNavigateToCurriculum}
          >
            จัดการหลักสูตร
          </span>
        </p>
      </div>
    </div>
  );
}
