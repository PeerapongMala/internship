import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWNeutralBox from '@component/web/cw-neutral-box';
import CWTitleBack from '@component/web/cw-title-back';
import Breadcrumbs from '@domain/g01/g01-d02/local/component/web/atom/wc-a-breadcrumbs';

export default function GamificationSpecialHeader() {
  return (
    <div className="flex flex-col gap-5">
      <CWBreadcrumbs
        links={[
          { label: 'ระบบเกม', href: '#' },
          { label: 'จัดการรางวัลด่าน', href: '#' },
          { label: 'จัดการรางวัลพิเศษ', href: '#' },
        ]}
      />
      <div className="flex flex-col gap-1">
        <CWTitleBack label="จัดการรางวัลพิเศษ" href="../../" />
        <p className="mt-3">
          ผู้เล่นจะได้รับรางวัลพิเศษเมื่อผ่านด่านที่กำหนด สามารถเลือกไอเเทมได้มากกว่า 1
          รายการ
        </p>
      </div>
      <CWNeutralBox className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold leading-8">ด่านที่ 1</h1>
        <p>ปีการศึกษา: 2567 / คณิตศาสตร์ / ป.4 / บทที่ 1-1 จำนวนนับไม่เกิน 1 ล้าน</p>
      </CWNeutralBox>
    </div>
  );
}
