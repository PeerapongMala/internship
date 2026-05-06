import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

export default function TranslationHeader() {
  return (
    <div className="mb-4 flex flex-col gap-y-6">
      <CWBreadcrumbs
        links={[
          { label: 'สำหรับแอดมิน', href: '#' },
          { label: 'จัดการข้อความ', href: '/admin/translation' },
        ]}
      />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold leading-8">จัดการข้อความ</h1>
      </div>
    </div>
  );
}
