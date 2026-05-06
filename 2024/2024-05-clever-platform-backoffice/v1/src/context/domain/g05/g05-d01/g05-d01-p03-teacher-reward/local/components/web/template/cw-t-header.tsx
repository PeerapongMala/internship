import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWSchoolCard from '@component/web/cw-school-card';

export default function Header() {
  return (
    <div className="mb-5 flex flex-col gap-y-6">
      <CWBreadcrumbs
        links={[
          { label: 'การเรียนการสอน', href: '#' },
          { label: 'การให้รางวัลโดยครู', href: '#' },
        ]}
      />
      <CWSchoolCard name="โรงเรียนสาธิตมัธยม" code="000000001" subCode="AA109" />
      <h1 className="text-2xl font-bold">การให้รางวัลโดยครู</h1>
    </div>
  );
}
