import Breadcrumbs from '@domain/g01/g01-d02/local/component/web/atom/wc-a-breadcrumbs';

export default function AffiliationHeader() {
  return (
    <div className="flex flex-col gap-y-6">
      <Breadcrumbs
        links={[
          { label: 'สำหรับแอดมิน', href: '#' },
          { label: 'สังกัดโรงเรียน', href: '#' },
        ]}
      />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold leading-8">สังกัดโรงเรียน</h1>
        <p>
          สังกัดนี้จะใช้แกนหลักสูตรนี้เป็นค่าเริ่มต้น หากต้องการแก้ไขหลักสูตร
          กรุณาแก้ไขที่เมนู{' '}
          <span className="cursor-pointer text-[#4361EE] underline">จัดการหลักสูตร</span>
        </p>
      </div>
    </div>
  );
}
