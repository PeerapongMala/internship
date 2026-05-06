import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import Breadcrumbs from '../atom/wc-a-breadcrumbs';
import { Link } from '@tanstack/react-router';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { Curriculum } from '@domain/g02/g02-d01/local/type';
import StoreGlobalPersist from '@store/global/persist';
import CWTitleGroup from '@component/web/cw-title-group';

export default function ProfileHeader() {
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);
  return (
    <div className="flex flex-col gap-y-6">
      <CWBreadcrumbs
        links={[
          { label: 'สำหรับแอดมิน', href: '#' },
          { label: 'จัดการผู้ใช้งาน', href: '#' },
          { label: 'แก้ไขโปรไฟล์', href: '#' },
        ]}
      />

      <CWTitleGroup
        listText={[
          'สังกัดของฉัน',
          `${curriculumData.name} (${curriculumData.short_name})`,
        ]}
      />

      <div className="flex items-center gap-x-4">
        <Link to="/curriculum">
          <IconArrowBackward className="h-8 w-8 p-1" />
        </Link>
        <h2 className="text-2xl font-bold">แก้ไขโปรไฟล์</h2>
      </div>
    </div>
  );
}
