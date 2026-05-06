import IconDownload from '@component/web/atom/wc-a-icons/IconDownload';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import CWButton from '@component/web/cw-button';
import WCADropdown from '../atom/WCADropdown';
import { Academicyear, Classroom, Lesson, Subject, Year } from '../../../type';
import { Thai } from 'flatpickr/dist/l10n/th';
import { toDateTH } from '@global/utils/date';
import { GetAcademicYearRangesResponse } from '@domain/g03/g03-d04/local/api/group/academic-year/type';
import { getAcademicYearRange } from '@global/utils/store/get-academic-year-range-data';
import { getClassData } from '@global/utils/store/get-class-data';
import { getUserData } from '@global/utils/store/getUserData';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import CWClassSelector from '@component/web/organism/cw-o-select-class-student';
import CWSelectedLessonCompile from '@component/web/organism/cw-o-select-lesson-compile';
import CWModalAcademicYearRange from '@component/web/cw-modal/cw-modal-academicyear-range';
import CWMAccordion from '@component/web/molecule/cw-m-accordion';

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
}

const CWHeaderSection = ({
  lesson,
  selectedClassroom,
  selectedLesson,
  onClassroomChange,
  onLessonChange,
}: FilterSectionProps) => {
  const disabledDate = true;

  const userData = getUserData();
  const classData = getClassData();
  const schoolId = userData?.school_id;
  const subjectId = userData?.subject[0].id;
  const academicYearRangeData = getAcademicYearRange();
  const filters = getClassData();

  const lessonSelected =
    selectedLesson && selectedLesson.length > 0 && lesson
      ? lesson.find((l) => l.lesson_id === selectedLesson[0]) || null
      : null;

  const [selectedValueDateRange, setSelectedValueDateRange] =
    useState<GetAcademicYearRangesResponse | null>(academicYearRangeData);

  const [openModalAcademicYear, setOpenModalAcademicYear] = useState(false);
  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date }>();

  useEffect(() => {
    if (academicYearRangeData) {
      setSelectedValueDateRange(academicYearRangeData);
      setDateRange({
        startDate: dayjs(academicYearRangeData.start_date).toDate(),
        endDate: dayjs(academicYearRangeData.end_date).toDate(),
      });
    }
  }, [academicYearRangeData]);

  const handleCloseModalAcademicYear = () => {
    setOpenModalAcademicYear(false);
  };
  return (
    <div>
      {/* Date Range Selector */}
      <CWMAccordion title="ตัวกรอง" headerClassName="bg-[#D5DDFF] mt-5 ">
        <div className="mt-3 space-y-4 bg-[#F0F3FF] p-3 p-4 shadow-[0px_1px_3px_0px_#0000001A,_0px_1px_2px_0px_#0000001A]">
          <div className="flex h-auto w-full flex-col gap-2 md:h-[35px] md:flex-row md:gap-3">
            <CWButton
              title={'เลือกช่วงเวลา'}
              onClick={() => setOpenModalAcademicYear(true)}
              className="w-full text-nowrap md:w-auto"
            />
            <div className="w-full md:w-60">
              <WCAInputDateFlat
                hideIcon
                options={{
                  mode: 'range',
                  dateFormat: 'd/m/Y',
                  locale: {
                    ...Thai,
                  },
                }}
                value={
                  selectedValueDateRange
                    ? [
                        new Date(selectedValueDateRange.start_date).toISOString(),
                        new Date(selectedValueDateRange.end_date).toISOString(),
                      ]
                    : undefined
                }
                onChange={(dates) => {
                  const newStartDate = dates[0];
                  const newEndDate = dates[1];

                  setDateRange({
                    startDate: newStartDate,
                    endDate: newEndDate,
                  });

                  if (selectedValueDateRange && selectedValueDateRange.id !== undefined) {
                    setSelectedValueDateRange({
                      ...selectedValueDateRange,
                      start_date: dayjs(newStartDate).format('YYYY-MM-DD'),
                      end_date: dayjs(newEndDate).format('YYYY-MM-DD'),
                    });
                  }
                }}
                disabled
                className={`w-full ${disabledDate ? 'cursor-not-allowed' : ''} mt-2 bg-white`}
              />
            </div>
          </div>

          {/* Class Selector */}
          <div className="w-full">
            <CWClassSelector
              buttonClassName="w-1/2 shrink"
              inputClassName="w-1/2"
              classes={filters}
              autoSelectFirstClass={true}
            />
          </div>

          {/* Lesson Selector */}
          <div className="w-full">
            <CWSelectedLessonCompile
              buttonClassName="shrink"
              buttonParentClassName="w-1/2"
              inputClassName="w-1/2"
              lesson={lessonSelected as null}
              onSelected={(lesson) => {
                if (lesson) {
                  onLessonChange([lesson.lesson_id]);
                } else {
                  onLessonChange([]);
                }
              }}
              class_id={selectedClassroom ?? []}
              subject_id={[subjectId]}
              mode="single"
            />
          </div>

          {/* Academic Year Modal */}
          <CWModalAcademicYearRange
            open={openModalAcademicYear}
            onClose={handleCloseModalAcademicYear}
            setSelectedValueDateRange={setSelectedValueDateRange}
            setDateRange={setDateRange}
            schoolId={Number(schoolId)}
          />
        </div>
      </CWMAccordion>
    </div>
  );
};

export default CWHeaderSection;
