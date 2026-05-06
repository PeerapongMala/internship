import IconDownload from '@component/web/atom/wc-a-icons/IconDownload';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import CWButton from '@component/web/cw-button';
import WCADropdown from '../atom/WCADropdown';
import { Academicyear, Classroom, Lesson, Subject, Year } from '../../../type';
import { Thai } from 'flatpickr/dist/l10n/th';
import { toDate } from '@amcharts/amcharts5/.internal/core/util/Type';
import { toDateTH } from '@global/utils/date';
import CWModalAcademicYearRange from '@component/web/cw-modal/cw-modal-academicyear-range';
import { useEffect, useState } from 'react';
import { GetAcademicYearRangesResponse } from '@domain/g03/g03-d04/local/api/group/academic-year/type';
import dayjs from '@global/utils/dayjs';
import StoreGlobalPersist from '@store/global/persist';
import { getUserData } from '@global/utils/store/getUserData';
import CWClassSelector from '@component/web/organism/cw-o-select-class-student';
import CWSelectedLessonCompile from '@component/web/organism/cw-o-select-lesson-compile';
import { getClassData } from '@global/utils/store/get-class-data';
import {
  getAcademicYearRange,
  getDefaultAcademicYearRange,
} from '@global/utils/store/get-academic-year-range-data';
import showMessage from '@global/utils/showMessage';

interface FilterSectionProps {
  academicYear: Academicyear[];
  year: Year[];
  classroom: Classroom[];
  subject: Subject[];
  lesson: Lesson[];

  selectedAcademicYear: number | null;
  selectedYear: string | null;
  onSelectedYearName?: (value: number | null) => void;
  selectedClassroom: number[] | null;
  selectedSubject: number[] | null;
  selectedLesson: number[] | null;

  onAcademicYearChange: (value: number | null) => void;
  onYearChange: (value: string | null) => void;
  onClassroomChange: (value: number[]) => void;
  onSubjectChange: (value: number[]) => void;
  onLessonChange: (value: number[]) => void;

  selectedStartDate: string | null;
  selectedEndDate: string | null;
  onDateChange: (startDate: string | null, endDate: string | null) => void;
}

const CWHeaderSection = ({
  lesson,
  selectedClassroom,
  selectedLesson,
  onClassroomChange,
  onSubjectChange,
  onLessonChange,
  selectedStartDate,
  selectedEndDate,
  onDateChange,
}: FilterSectionProps) => {
  const userData = getUserData();
  const classData = getClassData();
  const schoolId = userData?.school_id;
  const subjectId = userData?.subject[0].id;
  const academicYearRangeData = getAcademicYearRange();
  const defaultAcademicYearRangeData = getDefaultAcademicYearRange();
  const filters = getClassData();

  const [minDate, setMinDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);

  const lessonSelected =
    selectedLesson && selectedLesson.length > 0 && lesson
      ? lesson.find((l) => l.lesson_id === selectedLesson[0]) || null
      : null;

  const [clearLesson, setClearLesson] = useState(false);

  const [selectedValueDateRange, setSelectedValueDateRange] =
    useState<GetAcademicYearRangesResponse | null>(academicYearRangeData);

  const [openModalAcademicYear, setOpenModalAcademicYear] = useState(false);
  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date }>();

  useEffect(() => {
    if (academicYearRangeData) {
      setSelectedValueDateRange(academicYearRangeData);
      setMinDate(new Date(academicYearRangeData.start_date));
      setMaxDate(new Date(academicYearRangeData.end_date));
    }
  }, [academicYearRangeData]);

  const handleDateChange = (dates: Date[]) => {
    if (!dates || dates.length < 2 || !defaultAcademicYearRangeData) return;

    const newStartDate = dates[0].toISOString();
    const newEndDate = dates[1].toISOString();

    const isStartValid =
      new Date(newStartDate) >= new Date(defaultAcademicYearRangeData.start_date);
    const isEndValid =
      new Date(newEndDate) <= new Date(defaultAcademicYearRangeData.end_date);

    if (!isStartValid || !isEndValid) {
      showMessage(
        `กรุณาเลือกวันที่ระหว่าง ${new Date(defaultAcademicYearRangeData.start_date).toLocaleDateString('th-TH')} ถึง ${new Date(defaultAcademicYearRangeData.end_date).toLocaleDateString('th-TH')}`,
        'warning',
      );
      onDateChange(
        defaultAcademicYearRangeData.start_date,
        defaultAcademicYearRangeData.end_date,
      );
      return;
    }
    onDateChange(newStartDate, newEndDate);
  };

  const handleCloseModalAcademicYear = () => {
    setOpenModalAcademicYear(false);
  };

  const handleClassChange = (classIds: number[]) => {
    onClassroomChange(classIds);

    if (!classIds || classIds.length === 0) {
      setClearLesson(true);
      onLessonChange([]);
      onSubjectChange([]);
    } else {
      setClearLesson(false);
    }
  };
  const handleClearLesson = () => {
    onLessonChange([]);
  };
  useEffect(() => {
    if (clearLesson) {
      setClearLesson(false);
    }
  }, [clearLesson]);

  return (
    <div className="mt-5 flex gap-5">
      <div className="flex gap-5">
        <button
          type="button"
          className="btn btn-primary flex gap-1"
          onClick={() => setOpenModalAcademicYear(true)}
        >
          {'เลือกช่วงเวลา'}
        </button>
        <div className="w-60">
          <WCAInputDateFlat
            options={{
              mode: 'range',
              dateFormat: 'd/m/Y',
              locale: { ...Thai },
              minDate: defaultAcademicYearRangeData
                ? new Date(defaultAcademicYearRangeData.start_date)
                : undefined,
              maxDate: defaultAcademicYearRangeData
                ? new Date(defaultAcademicYearRangeData.end_date)
                : undefined,
            }}
            value={
              selectedStartDate && selectedEndDate
                ? [new Date(selectedStartDate), new Date(selectedEndDate)]
                : undefined
            }
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div>
        <CWClassSelector
          classes={filters}
          autoSelectFirstClass={true}
          onChange={handleClassChange}
        />
      </div>
      <div>
        <CWSelectedLessonCompile
          lesson={lessonSelected}
          onSelected={(lesson) => {
            if (lesson) {
              onLessonChange([lesson.lesson_id]);
              onSubjectChange([lesson.subject_id]);
            } else {
              onLessonChange([]);
              onSubjectChange([]);
            }
          }}
          class_id={selectedClassroom ?? []}
          subject_id={[subjectId]}
          mode="single"
          clearData={clearLesson ? handleClearLesson : undefined}
        />
      </div>
      <CWModalAcademicYearRange
        open={openModalAcademicYear}
        onClose={handleCloseModalAcademicYear}
        setSelectedValueDateRange={setSelectedValueDateRange}
        setDateRange={setDateRange}
        schoolId={Number(schoolId)}
        deleteMode={false}
        createMode={false}
      />
    </div>
  );
};

export default CWHeaderSection;
