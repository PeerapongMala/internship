import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import {
  TJsonStudentLessonScoreData,
  TStudentIndicatorAdditionalField,
} from '@domain/g06/g06-d03/local/type';
import { areFloatsEqual } from '@domain/g06/local/utils/score';
import { InputHTMLAttributes, useMemo } from 'react';

type InputScoreProps = InputHTMLAttributes<HTMLInputElement> & {
  comparedValue?: number;
  isAdvancedMode?: boolean;
  additionalField?: TStudentIndicatorAdditionalField;
  onClickAdvMode?: () => void;

  /**
   * For calculate is score from game or not.
   */
  studentLessonScore?: TJsonStudentLessonScoreData[];
  studentID?: number;
  indicatorID?: number;
};

// million-ignore
/**
 * This props base on input but only class name will use at td.
 */
const TDScore = ({
  className,
  isAdvancedMode,
  additionalField,
  onClickAdvMode,
  comparedValue,
  studentLessonScore,
  studentID,
  indicatorID,
  disabled,
  ...props
}: InputScoreProps) => {
  const value = useMemo(() => {
    return props.value;
  }, [props.value]);

  // logic to show compared component or not
  const isCompared = useMemo(() => {
    return comparedValue == value || comparedValue == undefined;
  }, [comparedValue, value, isAdvancedMode]);

  // find is gameScore match user input's score
  // true = score from game (#4361ee or primary)
  // false = replace's game score by user (#fb923c or orange-600)
  // null == not connected to game (black. do not change)
  const isGameScore: boolean | null = useMemo(() => {
    // If the score has been replaced, the color should be orange regardless of the game score.
    if (additionalField?.is_replace_score === true) {
      return false;
    }

    // Find the student's score from the game data.
    const studentScoreData = studentLessonScore?.find(
      (data) =>
        data.evaluation_student_id === studentID &&
        data.evaluation_form_indicator_id === indicatorID,
    );

    // If no game score is found or it's invalid, and the score hasn't been replaced,
    // it means the score is not connected to a game.
    if (!studentScoreData || isNaN(studentScoreData.score)) {
      return null;
    }

    // At this point, we have a valid game score.
    // The score color should be primary, which is represented by `true`.
    return true;
  }, [
    value,
    studentLessonScore,
    studentID,
    indicatorID,
    additionalField?.is_replace_score,
  ]);

  const isInputDisableInAdvMode = useMemo(() => {
    return isGameScore != null && isAdvancedMode;
  }, [isGameScore, isAdvancedMode]);

  const scoreColor = useMemo(() => {
    if (isGameScore) {
      return 'text-primary';
    }

    if (isGameScore == false) return 'text-orange-600';

    return '';
  }, [isGameScore]);

  return (
    <td
      onClick={isAdvancedMode ? onClickAdvMode : undefined}
      className={cn(className, isCompared ? '' : '!bg-orange-400', scoreColor)}
    >
      {isCompared ? (
        // Show input when not advanced mode
        // Show button to open modal when advancedMode
        isAdvancedMode ? (
          <button className="h-full w-full" onClick={onClickAdvMode} disabled={disabled}>
            {value}
          </button>
        ) : (
          <>
            <input
              className={
                'no-arrow block h-full w-full !bg-transparent text-center hide-arrow focus:outline-none'
              }
              type="number"
              min={0}
              disabled={disabled || isInputDisableInAdvMode}
              {...props}
              value={value}
            />
          </>
        )
      ) : (
        <span className="text-nowrap">
          {value}
          {'>'}
          {comparedValue}
        </span>
      )}
    </td>
  );
};

export default TDScore;
