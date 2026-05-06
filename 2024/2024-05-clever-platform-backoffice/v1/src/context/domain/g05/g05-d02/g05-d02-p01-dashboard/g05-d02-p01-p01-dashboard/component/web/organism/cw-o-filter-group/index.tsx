import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import CWSelect from '@component/web/cw-select';
import CWMAccordion from '@component/web/molecule/cw-m-accordion';
import WCADropdown from '@domain/g03/g03-d01/local/components/web/atom/WCADropdown';
import {
  FilterLubLesson,
  OverviewProp,
  Subject,
} from '@domain/g05/g05-d02/local/types/overview';
import { useMemo } from 'react';

interface ExtendedOverviewProp extends OverviewProp {
  lessonData?: FilterLubLesson[];
  selectedLesson?: number;
  onLessonChange?: (lessonId: number) => void;
}

const FilterGroup = ({
  subjectData = [],
  selectedSubject,
  onSubjectChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  lessonData = [],
  selectedLesson,
  onLessonChange,
}: ExtendedOverviewProp) => {
  const subjectOptions = useMemo(() => {
    return subjectData
      .filter((subject) => subject?.subject_name && subject?.subject_id)
      .map((subject) => ({
        label: subject.subject_name || 'ไม่มีชื่อวิชา',
        value: subject.subject_id?.toString() || '',
      }));
  }, [subjectData]);

  const lessonOptions = useMemo(() => {
    return lessonData.map((lesson) => ({
      value: lesson.lesson_id?.toString() || '',
      label: lesson.lesson_name || 'ไม่มีชื่อบทเรียน',
    }));
  }, [lessonData]);

  const selectedSubjectName = subjectData?.find(
    (s) => s.subject_id === selectedSubject,
  )?.subject_name;
  const selectedLessonName = lessonData?.find(
    (l) => l.lesson_id === selectedLesson,
  )?.lesson_name;

  const formatDateToCustom = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleStartDateChange = (dates: Date[]) => {
    if (dates && dates.length > 0 && onStartDateChange) {
      onStartDateChange(formatDateToCustom(dates[0]));
    } else if (onStartDateChange) {
      onStartDateChange(undefined);
    }
  };

  const handleEndDateChange = (dates: Date[]) => {
    if (dates && dates.length > 0 && onEndDateChange) {
      onEndDateChange(formatDateToCustom(dates[0]));
    } else if (onEndDateChange) {
      onEndDateChange(undefined);
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <CWMAccordion className="w-full" title="ตัวกรอง" headerClassName="bg-[#D5DDFF]">
        <div className="mt-3 flex w-full flex-col gap-3 bg-[#F0F3FF] px-3 py-5">
          <div className="grid w-full grid-cols-2 gap-3">
            <div className="md:col-span-1">
              <WCAInputDateFlat
                placeholder="ตั้งแต่วันที่"
                value={startDate}
                onChange={handleStartDateChange}
                hideIcon
                className="w-full"
              />
            </div>
            <div className="md:col-span-1">
              <WCAInputDateFlat
                placeholder="ถึงวันที่"
                value={endDate}
                onChange={handleEndDateChange}
                hideIcon
                className="w-full"
              />
            </div>
          </div>

          <div className="md:col-span-1">
            <WCADropdown
              placeholder={selectedSubjectName || 'เลือกวิชา'}
              options={subjectOptions}
              onSelect={(selected) => onSubjectChange?.(Number(selected))}
            />
          </div>
          <div className="md:col-span-1">
            <WCADropdown
              placeholder={selectedLessonName || 'เลือกบทเรียน'}
              options={lessonOptions}
              onSelect={(selected) => onLessonChange?.(Number(selected))}
              disabled={!selectedSubject}
            />
          </div>
        </div>
      </CWMAccordion>
    </div>
  );
};

export default FilterGroup;
