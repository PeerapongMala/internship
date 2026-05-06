import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWNeutralBox from '@component/web/cw-neutral-box';
import CWTitleBack from '@component/web/cw-title-back';
import Breadcrumbs from '@domain/g01/g01-d02/local/component/web/atom/wc-a-breadcrumbs';
import { GetDataCard } from '@domain/g04/g04-d04/local/type';

export default function GamificationSpecialHeader({
  dataCard,
}: {
  dataCard: GetDataCard[];
}) {
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
        <CWTitleBack
          label="จัดการรางวัลพิเศษ"
          href="/gamemaster/gamification?tab=special"
        />
        <p className="mt-3">
          ผู้เล่นจะได้รับรางวัลพิเศษเมื่อผ่านด่านที่กำหนด สามารถเลือกไอเทมได้มากกว่า 1
          รายการ
        </p>
      </div>
      {dataCard.length > 0 && (
        <CWNeutralBox className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold leading-8">{`ด่านที่ ${dataCard[0].index}`}</h1>
          <p>
            {`ปีการศึกษา: ${dataCard[0].year} / ${dataCard[0].subject_group} / ${dataCard[0].year} / ${dataCard[0].lesson} - ${dataCard[0].sub_lesson}`}
          </p>
        </CWNeutralBox>
      )}
    </div>
  );
}
