import Breadcrumbs from '@component/web/atom/Breadcums';
import SubBreadcrumbs from '../../molecule/SubBreadcrumbs';
import Tab from '../../organism/Tab';
import { GetEvaluationForm } from '@domain/g06/g06-d05/local/api/type';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

interface PropData {
  breadcrumb: GetEvaluationForm | undefined;
}

export default function HeaderG0605({ breadcrumb }: PropData) {
  return (
    <>
      {/* <CWBreadcrumbs
        links={[
          { label: 'ระบบตัดเกรด', href: '/', disabled: true },
          { label: 'จัดการใบประเมิน', href: '/grade-system/evaluation' },
          { label: 'สมุดบันทึกการพัฒนาคุณภาพผู้เรียน (ปพ.5)', href: '/' },
        ]}
      /> */}

      <SubBreadcrumbs
        title="สมุดบันทึกการพัฒนาคุณภาพผู้เรียน (ปพ.5)"
        links={[
          { label: `ปีการศึกษา ${breadcrumb?.academic_year ?? '-'}`, href: '/' },
          { label: `${breadcrumb?.year ?? '-'}`, href: '/' },
          { label: `ห้อง ${breadcrumb?.school_room ?? '-'}`, href: '/' },
        ]}
        description={`นักเรียน ${breadcrumb?.student_count ?? 0} คน`}
      />
      <Tab />
    </>
  );
}
