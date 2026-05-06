import { CWStageCard } from '../cw-stagecard';
import { LevelReward, StageValues } from '@domain/g04/g04-d04/local/type';

const CWMedium = ({ records }: { records: LevelReward[] }) => {
  return (
    <div className="w-full bg-white p-5">
      <div className="flex w-full justify-center gap-5">
        {records.map((record) => (
          <CWStageCard
            key={record.id}
            title={`ผ่านด่านด้วยคะแนน ${record.star_required ?? 0} ดาว`}
            star_required={record.star_required ?? 0}
            gold_coin={record.gold_coin ?? 0}
            arcade_coin={record.arcade_coin ?? 0}
          />
        ))}
      </div>
    </div>
  );
};

export default CWMedium;
