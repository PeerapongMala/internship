import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { TGeneralTemplateAdditionalData } from '@domain/g06/local/types/template';
import dayjs from '@global/utils/dayjs';

type SelectNutritionAdditionalDataProps = {
  className?: string;
  required?: boolean;
  disabled?: boolean;
  additionalData?: Pick<TGeneralTemplateAdditionalData, 'nutrition'>;
  onChange?: (data: TGeneralTemplateAdditionalData) => void;
};

/**
 * The nutrition data is stored as a 2D array `nutrition[termIndex][roundIndex]`
 * to clearly separate each academic term (ภาคเรียน) and its corresponding check-in round (ครั้งที่).
 *
 * For example:
 * - `termIndex = 0` is ภาคเรียนที่ 1
 * - `roundIndex = 0` is ครั้งที่ 1 of that term
 *
 * This structure allows flexibility to support multiple rounds per term,
 * keeps the data predictable, and aligns with how Thai school evaluations are scheduled.
 *
 * The form renders inputs like:
 * - ภาคเรียนที่ 1 ครั้งที่ 1
 * - ภาคเรียนที่ 1 ครั้งที่ 2
 * - ภาคเรียนที่ 2 ครั้งที่ 1
 * - ภาคเรียนที่ 2 ครั้งที่ 2
 */

const SelectNutritionAdditionalData = ({
  className,
  additionalData,
  onChange,
  disabled,
  required,
}: SelectNutritionAdditionalDataProps) => {
  const termCount = 2;
  const roundPerTerm = 2;

  const handleDateChange = (
    termIndex: number,
    roundIndex: number,
    selectedDates: Date[],
  ) => {
    const formattedDate = dayjs(selectedDates[0]).format('YYYY-MM-DD');

    const updatedNutrition = [...(additionalData?.nutrition ?? [])];

    // Ensure term slot
    if (!updatedNutrition[termIndex]) {
      updatedNutrition[termIndex] = [];
    }

    // Set value
    updatedNutrition[termIndex][roundIndex] = {
      date: formattedDate,
    };

    onChange?.({
      // comment this cause this will reset other additionalData field
      //   ...additionalData,
      nutrition: updatedNutrition,
    });
  };

  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      {Array.from({ length: termCount }).map((_, termIndex) =>
        Array.from({ length: roundPerTerm }).map((_, roundIndex) => {
          const dateValue = additionalData?.nutrition?.[termIndex]?.[roundIndex]?.date;
          return (
            <WCAInputDateFlat
              key={`${termIndex}-${roundIndex}`}
              className="flex-1"
              label={`ภาคเรียนที่ ${termIndex + 1} ครั้งที่ ${roundIndex + 1}`}
              disabled={disabled}
              required={required}
              value={dateValue}
              onChange={(dates) => handleDateChange(termIndex, roundIndex, dates)}
            />
          );
        }),
      )}
    </div>
  );
};

export default SelectNutritionAdditionalData;
