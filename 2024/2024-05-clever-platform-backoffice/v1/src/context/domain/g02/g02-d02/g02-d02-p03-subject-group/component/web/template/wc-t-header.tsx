import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import Breadcrumbs from '../atom/wc-a-breadcrumbs';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';
import { ICurriculum } from '@domain/g00/g00-d00/local/type';
import { IManageYear } from '@domain/g02/g02-d02/local/type';
import { useEffect, useState } from 'react';
import API from '@domain/g02/g02-d02/local/api';
import CWTitleGroup from '@component/web/cw-title-group';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

export default function ManageSubjectGroupHeader() {
  const curriculumData: ICurriculum =
    StoreGlobalPersist.StateGetAllWithUnsubscribe().curriculumData;
  if (!curriculumData) {
    window.location.href = `/curriculum`;
  }

  const navigate = useNavigate();
  const { platformId, yearId } = useParams({ strict: false });
  const [year, setYear] = useState<IManageYear>();

  useEffect(() => {
    API.manageYear.GetById(yearId).then((res) => {
      if (res.status_code == 200) {
        setYear(res.data);
      } else {
        setYear(undefined);
      }
    });
  }, [yearId]);

  return (
    <div className="flex flex-col gap-y-6">
      {/* Breadcrumbs ส่วนแรก */}
      <CWBreadcrumbs
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '#' },
          { label: 'หลักสูตร', href: '#' },
          { label: `สังกัดวิชา ${curriculumData.short_name}`, href: '#' },
          {
            label: year?.seed_year_short_name || year?.seed_year_name || yearId,
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
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-x-4">
          <button
            onClick={() => {
              navigate({ to: `/content-creator/course/platform/${platformId}/year` });
            }}
          >
            <IconArrowBackward />
          </button>
          <div className="text-2xl font-bold">จัดการกลุ่มวิชา</div>
        </div>

        <div className="text-black">สร้างกลุ่มวิชา เพื่อจัดการโครงสร้างหลักสูตร</div>
      </div>

      {/* <div className="bg-gray-100  flex flex-col gap-y-1">
        <Breadcrumbs
          links={[
            { label: curriculumData.short_name, href: '#' },
            {
              label: yearId.seed_year_short_name || year?.seed_year_name || yearId,
              href: '#',
            },
          ]}
          variant="bold"
        />
      </div> */}
    </div>
  );
}
