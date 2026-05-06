import { Dispatch, SetStateAction } from 'react';
import DateRangeSelector from '../date-range-selector';

interface DateRangePickerContainerProps {
  startDate: Date | null;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
  isEndDateOpen: boolean;
  setIsEndDateOpen: Dispatch<SetStateAction<boolean>>;
}
const DateRangePickerContainer: React.FC<DateRangePickerContainerProps> = (props) => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isEndDateOpen,
    setIsEndDateOpen,
  } = props;

  const handleStartDateChange = (date: Date | null) => {

    setStartDate(date);
    if (!endDate && date) {
     
      setIsEndDateOpen(true);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setIsEndDateOpen(false);
  };

  const handleEndDateOpenChange = (isOpen: boolean) => {
    setIsEndDateOpen(isOpen);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  return (
    <div className="flex gap-x-[9px]">
      <DateRangeSelector
        label="ตั้งแต่วันที่"
        value={startDate}
        onChange={handleStartDateChange}
      />
      <DateRangeSelector
        label="จนถึงวันที่"
        value={endDate}
        onChange={handleEndDateChange}
        minDate={startDate}
        isOpen={isEndDateOpen}
        onOpenChange={handleEndDateOpenChange}
      />
    </div>
  );
};

export default DateRangePickerContainer;
