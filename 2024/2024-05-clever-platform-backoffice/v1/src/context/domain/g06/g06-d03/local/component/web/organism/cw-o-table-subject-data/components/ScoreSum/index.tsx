import { IStudentIndicatorDaum } from '@domain/g06/g06-d03/local/type';
import { useMemo } from 'react';
import { cn } from '@core/design-system/library/vristo/source/utils/cn'; // Assuming cn utility is available

type ScoreSumProps = {
  studentIndicatorData: IStudentIndicatorDaum[];
  comparedData?: IStudentIndicatorDaum[]; // Changed to optional for flexibility
  isAdvancedMode?: boolean;
};

// million-ignore
const ScoreSum = ({ studentIndicatorData, comparedData }: ScoreSumProps) => {
  const { currentSum, comparedSum, showComparison } = useMemo(() => {
    const sumReducer = (total: number, indicatorData: IStudentIndicatorDaum) =>
      total + indicatorData.value;

    const currentSum = studentIndicatorData.reduce(sumReducer, 0).toFixed(2);

    // If there's no data to compare against,  done
    if (!comparedData) {
      return { currentSum, comparedSum: null, showComparison: false };
    }

    // Calculate the compared ("before") sum
    const comparedSum = comparedData.reduce(sumReducer, 0).toFixed(2);

    return {
      currentSum,
      comparedSum,
      // Only show the comparison if the values are different
      showComparison: currentSum !== comparedSum,
    };
  }, [studentIndicatorData, comparedData]);

  return (
    <td
      className={cn('td-fixed border text-primary', showComparison && '!bg-orange-400')}
    >
      {showComparison ? (
        <>
          {comparedSum}
          {'>'}
          {currentSum}
        </>
      ) : (
        currentSum
      )}
    </td>
  );
};

export default ScoreSum;
