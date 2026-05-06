import Breadcrumbs from '@domain/g01/g01-d02/local/component/web/atom/wc-a-breadcrumbs';

export default function TranslationHeader() {
  return (
    <div className="mb-4 flex flex-col gap-y-6">
      <Breadcrumbs
        links={[
          { label: 'รายงาน', href: '#' },
          {
            label: 'ภาพรวมจังหวัด',
            href: '/admin/report',
          },
        ]}
      />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold leading-8">ภาพรวมจังหวัด</h1>
      </div>
    </div>
  );
}
