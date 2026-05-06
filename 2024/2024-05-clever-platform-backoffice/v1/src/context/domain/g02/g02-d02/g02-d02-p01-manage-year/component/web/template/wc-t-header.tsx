import { ICurriculum } from '@domain/g00/g00-d00/local/type';
import Breadcrumbs from '../atom/wc-a-breadcrumbs';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import StoreGlobalPersist from '@store/global/persist';
import { useNavigate } from '@tanstack/react-router';
import CWTitleGroup from '@component/web/cw-title-group';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

export default function ManageYearHeader({ totalRecords }: { totalRecords: number }) {
  const curriculumData: ICurriculum =
    StoreGlobalPersist.StateGetAllWithUnsubscribe().curriculumData;
  if (!curriculumData) {
    window.location.href = `/curriculum`;
  }

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-y-6">
      {/* Breadcrumbs ส่วนแรก */}
      <CWBreadcrumbs
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '#' },
          { label: 'หลักสูตร', href: '#' },
          { label: `สังกัดวิชา ${curriculumData.short_name}`, href: '#' },
          { label: 'จัดการชั้นปี', href: '#' },
        ]}
      />

      {/* Breadcrumbs ส่วนที่สอง */}
      <CWTitleGroup
        listText={[
          'สังกัดของฉัน',
          `${curriculumData.name} (${curriculumData.short_name})`,
        ]}
      />

      <div className="flex flex-col gap-3">
        {/* Header section พร้อมไอคอนและข้อความ */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              navigate({ to: '/content-creator/course/platform' });
            }}
            className="flex items-center gap-x-4"
          >
            <IconArrowBackward className="text-xl" />
          </button>
          <h2 className="text-2xl font-bold">จัดการชั้นปี</h2>
        </div>

        {/* คำอธิบายเพิ่มเติม */}
        <div className="text-black">เลือกชั้นปีที่คุณต้องการจัดการหลักสูตร</div>
      </div>

      {/* Section ที่มีชื่อและข้อมูลชั้นปี */}
      {/* <div className="bg-neutral-100 p-4 flex flex-col gap-y-1 rounded-md">
        <h2 className="text-2xl font-bold">{curriculumData.short_name}</h2>
        <p className="text-black">{totalRecords} ชั้นปี</p>
      </div> */}
    </div>
  );
}
