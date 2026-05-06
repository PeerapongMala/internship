import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import Breadcrumbs from '../atom/wc-a-breadcrumbs';
import { Link, useParams } from '@tanstack/react-router';
import { IManageYear } from '@domain/g02/g02-d02/local/type';
import StoreGlobalVolatile from '@store/global/volatile';
import StoreGlobalPersist from '@store/global/persist';
import { ICurriculum } from '@domain/g00/g00-d00/local/type';
import CWTitleGroup from '@component/web/cw-title-group';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

export default function SubjectFormHeader({
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
  const { yearData }: { yearData: IManageYear } = StoreGlobalVolatile.StateGet([
    'yearData',
  ]);
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
          to={`/content-creator/course/platform/$platformId/year/$yearId/subject-group/$subjectGroupId/subject-info`}
        >
          <IconArrowBackward className="h-8 w-8 p-1" />
        </Link>
        <h2 className="text-2xl font-bold">
          {type == 'updated' ? 'แก้ไข' : 'เพิ่ม'}หลักสูตร
        </h2>
      </div>

      {/* คำอธิบายเพิ่มเติม */}

      {/* Section ที่มีชื่อและข้อมูลชั้นปี */}
      {/* <div className="bg-gray-100  flex flex-col gap-y-1">
        <Breadcrumbs
          links={[
            { label: curriculumData.short_name, href: '#' },
            {
              label: yearData.seed_year_short_name || yearData.seed_year_name || yearId,
              href: '#',
            },
          ]}
          variant="bold"
        />
      </div> */}
    </div>
  );
}
