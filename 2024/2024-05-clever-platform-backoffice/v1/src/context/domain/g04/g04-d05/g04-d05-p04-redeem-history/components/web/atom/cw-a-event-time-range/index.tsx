import CWNeutralBox from '@component/web/cw-neutral-box';
import dayjs from '../../../../../../../../global/utils/dayjs';
import { CouponID } from '@domain/g04/g04-d05/local/type';
import { useMemo } from 'react';
import 'dayjs/locale/th'; // Import Thai locale

type EventTimeRangeProps = {
  couponInfo?: CouponID;
};
const EventTimeRange = ({ couponInfo }: EventTimeRangeProps) => {
  const startedTime = useMemo(() => {
    if (!couponInfo?.started_at) return '';

    return dayjs(couponInfo.started_at).locale('th').format('D MMM BBBB');
  }, [couponInfo?.started_at]);

  const endedTime = useMemo(() => {
    if (!couponInfo?.ended_at) return '';

    return dayjs(couponInfo.ended_at).locale('th').format('D MMM BBBB');
  }, [couponInfo?.ended_at]);

  return (
    <CWNeutralBox>
      <div className="flex flex-col gap-5">
        <h1>ช่วงเวลากิจกรรม</h1>
        <p className="text-[20px]">{`${startedTime} - ${endedTime}`}</p>
      </div>
    </CWNeutralBox>
  );
};

export default EventTimeRange;
