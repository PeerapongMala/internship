import { cn } from '@core/design-system/library/vristo/source/utils/cn';

type ScoreRankCellProps = {
  rank: number;
  comparedRank?: number;
};

// million-ignore
const ScoreRankCell = ({ rank, comparedRank }: ScoreRankCellProps) => {
  const showComparison = comparedRank !== undefined && comparedRank !== rank;

  return (
    <td
      className={cn('td-fixed border text-primary', showComparison && '!bg-orange-400')}
    >
      {showComparison ? (
        <>
          {comparedRank} {'>'} {rank}
        </>
      ) : (
        rank
      )}
    </td>
  );
};

export default ScoreRankCell;
