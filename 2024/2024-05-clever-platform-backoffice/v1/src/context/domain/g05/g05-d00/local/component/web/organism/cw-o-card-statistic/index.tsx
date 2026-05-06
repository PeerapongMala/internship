import CwProgress from '@component/web/cw-progress';
import Card from '../../molecule/cw-m-card';

type CardStatisticProps = {
  title: string;
  value: string;
  progress?: number;
};

const CardStatistic = ({ title, value, progress }: CardStatisticProps) => {
  return (
    <Card className="flex flex-col items-start p-4">
      <span className="text-sm">{title}</span>
      <span className="text-[24px]">{value}</span>
      {progress !== undefined && (
        <div className="w-[72px]">
          <CwProgress percent={progress} />
        </div>
      )}
    </Card>
  );
};

export default CardStatistic;
