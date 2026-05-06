import CWInput from '@component/web/cw-input';

type PanelNoCriteriaScoreAdvModeProps = {
  score?: number;
  maxScore: number;
  onScoreChange?: (score: number) => void;
};

const PanelNoCriteriaScoreAdvMode = ({
  score,
  maxScore,
  onScoreChange,
}: PanelNoCriteriaScoreAdvModeProps) => {
  return (
    <div className="flex items-center justify-between rounded-md border border-neutral-200 p-5 text-lg font-bold">
      <div>กรอกคะแนนไม่ใช้เกณฑ์</div>

      <div className="flex items-center gap-1">
        <CWInput
          type="number"
          value={score}
          min={0}
          max={maxScore}
          inputClassName="!text-lg !font-bold text-right  min-w-40"
          onChange={(e) => {
            let value = Number(e.target.value);

            if (isNaN(value)) return;
            if (value > maxScore) value = maxScore;

            onScoreChange?.(value);
          }}
        />
        <span>/{maxScore}</span>
      </div>
    </div>
  );
};

export default PanelNoCriteriaScoreAdvMode;
