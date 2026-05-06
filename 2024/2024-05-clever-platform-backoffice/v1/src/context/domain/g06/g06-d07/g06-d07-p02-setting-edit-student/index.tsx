import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWSchoolCard from '@component/web/cw-school-card';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import StoreGlobal from '@store/global';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';

const DomainJSX = () => {
  const navigate = useNavigate();
  const params: { studentID: string } = useParams({ strict: false });

  const studentID = Number(params.studentID);

  useEffect(() => {
    if (isNaN(studentID)) {
      navigate({ to: '../..' });
    }
  }, [studentID]);

  useEffect(() => {
    if (isNaN(studentID)) {
      navigate({ to: '../..' });
    }

    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <LayoutDefault>
      <CWBreadcrumbs
        showSchoolName
        links={[
          {
            href: '#',
            label: 'การเรียนการสอน',
          },
          {
            href: '#',
            label: 'ระบบตัดเกรด (ปพ.)',
          },
          {
            label: 'ตั้งค่า',
          },
          {
            label: 'แก้ไขข้อมูลนักเรียน',
          },
        ]}
      />

      <CWSchoolCard />

      <h2 className="my-5 text-xl font-bold">ตั้งค่าระบบ</h2>
    </LayoutDefault>
  );
};

export default DomainJSX;
