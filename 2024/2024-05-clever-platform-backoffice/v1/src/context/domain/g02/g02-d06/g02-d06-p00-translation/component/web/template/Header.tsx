import { Link, useLocation } from '@tanstack/react-router';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

export default function TranslationHeader() {
  const location = useLocation();
  const path = location.pathname;

  let links = [
    { label: 'สำหรับแอดมิน', href: '#' },
    { label: 'จัดการข้อความ', href: '/admin/translation' },
  ];
  let backLink = '/admin/translation';

  if (path.includes('/content-creator')) {
    links = [
      { label: 'เกี่ยวกับหลักสูตร', href: '#' },
      { label: 'จัดการข้อความ', href: '/content-creator/translation' },
      // { label: "จัดการข้อความ", href: "/content-creator/translation" },
    ];
    backLink = '';
  } else if (path.includes('/academician')) {
    links = [
      { label: 'เกี่ยวกับหลักสูตร', href: '#' },
      { label: 'จัดการข้อความ', href: '/academician/translation' },
      // { label: "จัดการข้อความ", href: "/academician/translation" },
    ];
    backLink = '';
  }

  return (
    <div className="mb-4 flex flex-col gap-y-6">
      <CWBreadcrumbs links={links} showSchoolName />
      <div className="flex items-center gap-5">
        {backLink && (
          <Link to={backLink}>
            <IconArrowBackward />
          </Link>
        )}
        <h1 className="text-2xl font-bold leading-8">จัดการข้อความ</h1>
      </div>
    </div>
  );
}
