import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import Breadcrumbs from '../atom/wc-a-breadcrumbs';
import { Link } from '@tanstack/react-router';
import { IManageYear } from '@domain/g02/g02-d02/local/type';
import StoreGlobalVolatile from '@store/global/volatile';
import StoreGlobalPersist from '@store/global/persist';
import { ICurriculum } from '@domain/g00/g00-d00/local/type';

export default function ManageYearHeader() {
  const curriculumData: ICurriculum =
    StoreGlobalPersist.StateGetAllWithUnsubscribe().curriculumData;
  if (!curriculumData) {
    window.location.href = `/curriculum`;
  }

  const { yearData }: { yearData: IManageYear } = StoreGlobalVolatile.StateGet([
    'yearData',
  ]);
  return (
    <div className="flex flex-col gap-y-6">
      {/* Breadcrumbs ส่วนแรก */}
      <Breadcrumbs
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '#' },
          { label: 'หลักสูตร', href: '#' },
          { label: `สังกัดวิชา ${curriculumData.short_name}`, href: '#' },
          { label: yearData.seed_year_short_name || '', href: '#' },
          { label: 'จัดการหลักสูตร', href: '#' },
        ]}
      />

      {/* Breadcrumbs ส่วนที่สอง */}
      <Breadcrumbs
        links={[
          { label: 'สังกัดของฉัน', href: '#' },
          { label: `สังกัดวิชา ${curriculumData.short_name}`, href: '#' },
        ]}
        variant="bold"
      />

      {/* Header section พร้อมไอคอนและข้อความ */}
      <div className="flex items-center gap-x-4">
        <Link
          to={`/content-creator/course/${yearData.id}/subject-group?tab=หลักสูตร/วิชา`}
        >
          <IconArrowBackward className="h-8 w-8 p-1" />
        </Link>
        <h2 className="text-2xl font-bold">จัดการหลักสูตร</h2>
      </div>

      {/* คำอธิบายเพิ่มเติม */}

      {/* Section ที่มีชื่อและข้อมูลชั้นปี */}
      <div className="flex flex-col gap-y-1 bg-gray-100">
        <Breadcrumbs
          links={[
            { label: curriculumData.short_name, href: '#' },
            { label: yearData.seed_year_short_name || '', href: '#' },
          ]}
          variant="bold"
        />
      </div>
    </div>
  );
}
