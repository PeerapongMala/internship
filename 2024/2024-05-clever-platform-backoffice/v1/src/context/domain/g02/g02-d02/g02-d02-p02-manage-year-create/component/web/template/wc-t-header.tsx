import Breadcrumbs from '../atom/wc-a-breadcrumbs';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import { Link, useParams } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';
import { ICurriculum } from '@domain/g00/g00-d00/local/type';
import CWTitleGroup from '@component/web/cw-title-group';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

export default function ManageYearHeader({
  type = 'created',
}: {
  type: 'created' | 'updated';
}) {
  const curriculumData: ICurriculum =
    StoreGlobalPersist.StateGetAllWithUnsubscribe().curriculumData;
  if (!curriculumData) {
    window.location.href = `/curriculum`;
  }

  const { yearId } = useParams({ strict: false });
  const { platformId } = useParams({ strict: false });
  const pathname = `/content-creator/course/platform/${platformId}/year`;

  return (
    <div className="flex flex-col gap-y-6">
      {/* Breadcrumbs ส่วนแรก */}
      <CWBreadcrumbs
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '#' },
          { label: 'หลักสูตร', href: '#' },
          { label: `สังกัดวิชา ${curriculumData.short_name}`, href: '#' },
          { label: 'จัดการชั้นปี', href: '#' },
          { label: yearId ? yearId : 'เพิ่มชั้นปี', href: '#' },
        ]}
      />

      {/* Breadcrumbs ส่วนที่สอง */}
      <CWTitleGroup
        listText={[
          'สังกัดของฉัน',
          `${curriculumData.name} (${curriculumData.short_name})`,
        ]}
      />

      {/* Header section พร้อมไอคอนและข้อความ */}
      <div className="flex items-center gap-x-4">
        <Link to={pathname}>
          <IconArrowBackward />
        </Link>
        <h2 className="text-2xl font-bold">
          {type == 'updated' ? 'แก้ไขชั้นปี' : 'เพิ่มชั้นปี'}
        </h2>
      </div>
    </div>
  );
}
