import { OverviewProp } from '@domain/g05/g05-d03/local/types/overview';
import LevelChart from '../../template/chart/cw-a-level-passed';

const LevelInfo = ({
  overviewData,
  user_id,
  class_id,
  subject_id,
  startDate,
  endDate,
}: OverviewProp) => {
  const levelData = overviewData?.level_stats;

  const aggregatedData = levelData
    ? {
        total_level: levelData.total_level || 0,
        level_passed: levelData.level_passed || 0,
        level_failed: levelData.level_failed || 0,
      }
    : { total_level: 0, level_passed: 0, level_failed: 0 };
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="col-span-1 gap-5 rounded-md bg-white shadow-md">
        <div className="w-full border-b-2 border-neutral-100 px-2 py-3">
          <span className="flex items-center gap-2">
            <h1 className="font-bold">จำนวนด่านที่ผ่านโดยเฉลี่ย/ด่าน </h1>
            <p>{aggregatedData?.total_level} ด่าน</p>
          </span>
        </div>
        <div className="px-5 py-5">
          <div className="mt-[68px] h-[350px] w-full">
            <LevelChart
              passed={aggregatedData?.level_passed}
              notPassed={aggregatedData?.level_failed}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelInfo;
