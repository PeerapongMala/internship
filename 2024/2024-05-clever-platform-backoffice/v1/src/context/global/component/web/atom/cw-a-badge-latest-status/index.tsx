import IconError from '@core/design-system/library/component/icon/IconError';
import IconTask from '@core/design-system/library/component/icon/IconTask';

type BadgeLatestStatusProps = {
  isLatest?: boolean;
};

const BadgeLatestStatus = ({ isLatest }: BadgeLatestStatusProps) => {
  return isLatest ? (
    <span className="badge flex w-fit items-center gap-[2.5px] bg-[#E6FFEE] text-sm !text-success hover:bg-success-light">
      <IconTask className="h-3.5 w-3.5" /> ล่าสุด
    </span>
  ) : (
    <span className="badge flex items-center gap-[2.5px] bg-[#FFFAE0] text-sm !text-warning hover:bg-warning-light">
      <IconError className="h-3.5 w-3.5" /> ไม่ล่าสุด
    </span>
  );
};

export default BadgeLatestStatus;
