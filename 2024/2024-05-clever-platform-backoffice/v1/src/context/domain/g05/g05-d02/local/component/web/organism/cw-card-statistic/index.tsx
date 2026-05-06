import CwProgress from '@component/web/cw-progress';
import Card from '@domain/g05/g05-d00/local/component/web/molecule/cw-m-card';
import CWProgressBar from '../cw-progress-bar';

type CWCardStatisticProps = {
  title: string;
  value: number | string;
  progress?: number;
  total?: number;
};

const CWCardStatistic = ({ title, value, progress, total }: CWCardStatisticProps) => {
  return (
    <Card className="flex flex-col items-start p-4">
      <span className="text-sm">{title}</span>
      <span className="text-[24px]">
        {value}
        {total !== undefined && ` / ${total}`}
      </span>
      {progress !== undefined && (
        <div className="w-[72px]">
          <CWProgressBar score={progress || 0} total={total || 0} />
        </div>
      )}
    </Card>
  );
};

export default CWCardStatistic;
