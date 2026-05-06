import Breadcrumbs from '@component/web/atom/Breadcums';
import SubBreadcrumbs from '../../molecule/SubBreadcrumbs';
import Tab from '../../organism/Tab';

export default function HeaderG0605() {
  return (
    <>
      <Breadcrumbs
        links={[
          { label: 'โรงเรียนสาธิตมัธยม', href: '/' },
          { label: 'ระบบตัดเกรด', href: '/' },
          { label: 'สมุดบันทึกการพัฒนาคุณภาพผู้เรียน (ปพ.5)', href: '/' },
        ]}
      />

      <SubBreadcrumbs
        title="สมุดบันทึกการพัฒนาคุณภาพผู้เรียน (ปพ.5)"
        links={[
          { label: 'ปีการศึกษา 2564', href: '/' },
          { label: 'ป.1', href: '/' },
          { label: 'ห้อง 4', href: '/' },
          { label: 'เทอม 1', href: '/' },
        ]}
        description="นักเรียน 50 คน"
      />
      <Tab />
    </>
  );
}
