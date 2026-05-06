import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import Breadcrumbs from '@domain/g01/g01-d02/local/component/web/atom/wc-a-breadcrumbs';

export default function GamificationHeader() {
  return (
    <div className="mb-5 flex flex-col gap-y-6">
      <CWBreadcrumbs
        links={[
          { label: 'ระบบเกม', href: '#' },
          { label: 'จัดการรางวัลด่าน', href: '#' },
        ]}
      />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold leading-8">จัดการรางวัลด่าน</h1>
        <p>
          ผู้เล่นจะได้รับรางวัลเมื่อผ่านด่านตามรางวัลที่กำหนด จำนวนเหรียญทอง เหรียญ Arcade
          หรือรางวัลพิเศษของแต่ละด่าน ไม่สามารถเปลี่ยนแปลงได้
        </p>
      </div>
    </div>
  );
}
