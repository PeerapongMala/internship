import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { IStudentIndicatorDaum } from '@domain/g06/g06-d03/local/type';
import { useMemo } from 'react';

type ScorePercentageProps = {
  indicatorData: IStudentIndicatorDaum[];
  maxScore: number;
  comparedData?: IStudentIndicatorDaum[];
};

// million-ignore
const ScorePercentage = ({
  indicatorData,
  maxScore,
  comparedData,
}: ScorePercentageProps) => {
  const { currentPercentage, comparedPercentage, showComparison } = useMemo(() => {
    const currentSum = indicatorData.reduce((prev, score) => prev + score.value, 0);
    const currentCalc = ((currentSum / maxScore) * 100).toFixed(2);

    // If there's no data to compare against, done
    if (!comparedData) {
      return {
        currentPercentage: currentCalc,
        comparedPercentage: null,
        showComparison: false,
      };
    }

    // Calculate the compared ("before") percentage
    const comparedSum = comparedData.reduce((prev, score) => prev + score.value, 0);
    const comparedCalc = ((comparedSum / maxScore) * 100).toFixed(2);

    return {
      currentPercentage: currentCalc,
      comparedPercentage: comparedCalc,
      // Only show the comparison if the values are different
      showComparison: currentCalc !== comparedCalc,
    };
  }, [indicatorData, comparedData, maxScore]);

  return (
    <td
      className={cn(
        'td-fixed border text-primary',
        showComparison ? '!bg-orange-400' : '',
      )}
    >
      <span>
        {showComparison ? (
          <>
            {comparedPercentage}
            {'>'}
            {currentPercentage}
          </>
        ) : (
          currentPercentage
        )}
      </span>
    </td>
  );
};

export default ScorePercentage;
