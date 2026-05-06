import Breadcrumbs from '../atom/wc-a-breadcrumbs';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import { Link, useParams } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';
import { ICurriculum } from '@domain/g00/g00-d00/local/type';
import { IManageYear } from '@domain/g02/g02-d02/local/type';
import StoreGlobalVolatile from '@store/global/volatile';
import CWTitleGroup from '@component/web/cw-title-group';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

export default function ManageSubjectGroupFormHeader({
  type,
}: {
  type: 'created' | 'updated';
}) {
  const curriculumData: ICurriculum =
    StoreGlobalPersist.StateGetAllWithUnsubscribe().curriculumData;
  if (!curriculumData) {
    window.location.href = `/curriculum`;
  }

  const { yearData }: { yearData: IManageYear } = StoreGlobalVolatile.StateGet([
    'yearData',
  ]);

  const { platformId, yearId, subjectGroupId } = useParams({ strict: false });

  return (
    <div className="flex flex-col gap-y-6">
      {/* Breadcrumbs ส่วนแรก */}
      <CWBreadcrumbs
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '#' },
          { label: 'หลักสูตร', href: '#' },
          { label: `สังกัดวิชา ${curriculumData.short_name}`, href: '#' },
          {
            label: yearData.seed_year_short_name || yearData.seed_year_name || yearId,
            href: '#',
          },
          { label: 'จัดการหลักสูตร', href: '#' },
          { label: type == 'updated' ? subjectGroupId : 'เพิ่มกลุ่มวิชา', href: '#' },
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
        <Link
          to={`/content-creator/course/platform/${platformId}/year/${yearData.id ?? yearId}/subject-group`}
        >
          <IconArrowBackward className="h-8 w-8 p-1" />
        </Link>
        <h2 className="text-2xl font-bold">
          {type == 'updated' ? 'แก้ไข' : 'เพิ่ม'}กลุ่มวิชา
        </h2>
      </div>
    </div>
  );
}
