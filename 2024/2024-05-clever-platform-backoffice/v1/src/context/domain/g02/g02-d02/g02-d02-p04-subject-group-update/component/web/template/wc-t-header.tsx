import Breadcrumbs from '../atom/wc-a-breadcrumbs';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import { Link } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';
import { ICurriculum } from '@domain/g00/g00-d00/local/type';
import { IManageYear } from '@domain/g02/g02-d02/local/type';
import StoreGlobalVolatile from '@store/global/volatile';

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
          { label: 'แก้ไขกลุ่มวิชา', href: '#' },
        ]}
      />

      {/* Breadcrumbs ส่วนที่สอง */}
      <Breadcrumbs
        links={[
          { label: 'สังกัดของฉัน', href: '#' },
          { label: `${curriculumData.name} (${curriculumData.short_name})`, href: '#' },
        ]}
        variant="bold"
      />

      {/* Header section พร้อมไอคอนและข้อความ */}
      <div className="flex items-center gap-x-4">
        <Link to={`/content-creator/course/${yearData.id}/subject-group`}>
          <IconArrowBackward className="h-8 w-8 p-1" />
        </Link>
        <h2 className="text-2xl font-bold">แก้ไขกลุ่มวิชา</h2>
      </div>
    </div>
  );
}
