import { useState, useEffect } from 'react';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import { Pagination, Student, academicYear, Year } from '@domain/g03/g03-d07/local/type';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import CWPagination from '@component/web/cw-pagination';
import { getUserData } from '@global/utils/store/getUserData';
import API from '@domain/g03/g03-d01/local/api';
import { Lesson, SubjectFilter } from '@domain/g03/g03-d01/local/type';
import { getLesson } from '@global/utils/store/get-lesson-data';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@store/global/persist';
import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
import { getClassData } from '@global/utils/store/get-class-data';
import usePagination from '@global/hooks/usePagination';

interface ModalSelectLessonProp extends ModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (selectedLessons: Lesson[]) => void;
  initialSelected?: Lesson[];
  class_id: number[];
  subject_id: number[];
  mode?: 'single' | 'multiple';
  clearData?: () => void;
}

const CWModalSelectLesson = ({
  open,
  onClose,
  onSelect,
  initialSelected = [],
  class_id,
  subject_id,
  mode = 'multiple',
  clearData,
  ...rest
}: ModalSelectLessonProp) => {
  const userData = getUserData();
  const subjectData = userData?.subject[0];
  const lessonData = getLesson();
  const classData = getClassData();

  const [fetching, setFetching] = useState<boolean>(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [subject, setSubject] = useState<SubjectFilter[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedLessons, setSelectedLessons] = useState<Lesson[]>(
    initialSelected ?? lessonData,
  );
  const [selectedYear, setSelectedYear] = useState<string | null>();
  const [currentSubjectIds, setCurrentSubjectIds] = useState<number[]>(
    subject_id.length > 0 ? subject_id : subjectData ? [subjectData.id] : [],
  );
  const [filteredSubjects, setFilteredSubjects] = useState<SubjectFilter[]>([]);
  const { pagination, setPagination } = usePagination({
    isModal: true,
  });
  const totalPages = Math.ceil(pagination.total_count / pagination.limit);

  const handleCheckboxChange = (lesson?: Lesson) => {
    if (mode === 'single') {
      if (lesson) {
        setSelectedLessons([lesson]);
        (
          StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
        ).setLessonData([lesson]);
      }
      return;
    }

    if (!lesson) {
      if (allSelected) {
        setSelectedLessons([]);
      } else {
        setSelectedLessons([...lessons]);
      }
      setAllSelected(!allSelected);
    } else {
      setSelectedLessons((prev) => {
        const existing = prev.find(
          (l) => l.lesson_id === lesson.lesson_id && l.subject_id === lesson.subject_id,
        );
        if (existing) {
          return prev.filter(
            (l) =>
              !(l.lesson_id === lesson.lesson_id && l.subject_id === lesson.subject_id),
          );
        } else {
          return [...prev, lesson];
        }
      });
      setAllSelected(false);
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (mode === 'single') {
      setSelectedLessons([lesson]);
    }
  };

  useEffect(() => {
    if (
      mode === 'multiple' &&
      lessons.length > 0 &&
      selectedLessons.length === lessons.length
    ) {
      const allLessonsSelected = lessons.every((lesson) =>
        selectedLessons.some(
          (s) => s.lesson_id === lesson.lesson_id && s.subject_id === lesson.subject_id,
        ),
      );
      setAllSelected(allLessonsSelected);
    } else {
      setAllSelected(false);
    }
  }, [lessons, selectedLessons]);

  const fetchLessons = async (subjectIds: number[], page: number = 1) => {
    if (!currentSubjectIds) return;

    setFetching(true);
    try {
      const res = await API.dashboard.GetA10({
        class_ids: class_id,
        subject_ids: subjectIds,
        limit: pagination.limit,
        page: page,
      });

      if (res.status_code === 200) {
        setLessons(res.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination.total_count || res.data.length,
          page: page,
        }));
        if (res.data.length > 0) {
          const firstLesson = res.data[0];
          setSelectedLessons([firstLesson]);
          (
            StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
          ).setLessonData([firstLesson]);

          if (mode === 'single') {
            onSelect([firstLesson]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleYearSelect = async (selectedYear: string) => {
    setSelectedYear(selectedYear);
    setCurrentSubjectIds([]);
    setSelectedLessons([]);
    setAllSelected(false);
    const res = await API.dashboard.GetA16({
      limit: -1,
      year: selectedYear,
    });

    if (res.status_code === 200) {
      const newSubjects = res.data;
      const filtered = newSubjects.filter((sub) => sub.year_name === selectedYear);

      setSubject(newSubjects);
      setFilteredSubjects(filtered);

      const subjectFromStore =
        subjectData?.year_name === selectedYear
          ? filtered.find((sub) => sub.id === subjectData.id)
          : null;

      if (subjectFromStore) {
        setCurrentSubjectIds([subjectFromStore.id]);
        fetchLessons([subjectFromStore.id], 1);
      } else if (filtered.length > 0) {
        setCurrentSubjectIds([filtered[0].id]);
        fetchLessons([filtered[0].id], 1);
      }
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const yearRes = await API.dashboard.GetYearFilter({ limit: -1 });
      if (yearRes.status_code === 200) {
        setYears(yearRes.data);

        const initialYear = classData?.year || yearRes.data[0];
        if (initialYear) {
          setSelectedYear(initialYear);

          const subjectRes = await API.dashboard.GetA16({
            limit: -1,
            year: initialYear,
          });

          if (subjectRes.status_code === 200) {
            const initialSubjects = subjectRes.data.filter(
              (sub) => sub.year_name === initialYear,
            );
            setSubject(subjectRes.data);
            setFilteredSubjects(initialSubjects);

            const subjectFromStore =
              classData?.year === initialYear
                ? initialSubjects.find((sub) => sub.id === subjectData.id)
                : null;
            if (subjectFromStore) {
              setCurrentSubjectIds([subjectFromStore.id]);
              fetchLessons([subjectFromStore.id], 1);
            } else if (initialSubjects.length > 0) {
              setCurrentSubjectIds([initialSubjects[0].id]);
              fetchLessons([initialSubjects[0].id], 1);
            }
          }
        }
      }
    };

    loadInitialData();
  }, [classData?.class_id]);

  //remove data lesson
  useEffect(() => {
    if (classData) {
      if (classData.year !== selectedYear) {
        clearData?.();
        (
          StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
        ).setLessonData();
      }
    }
  }, [classData?.class_id, classData?.year, selectedYear]);

  useEffect(() => {
    if (!currentSubjectIds || currentSubjectIds.length === 0) return;
    fetchLessons(currentSubjectIds, pagination.page);
  }, [pagination.limit, pagination.page, currentSubjectIds, classData?.class_id]);

  const setCurrentPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const setPageSize = (size: number) => {
    setPagination((prev) => ({ ...prev, limit: size }));
  };

  return (
    <Modal
      className="w-full max-w-[1000px]"
      open={open}
      onClose={onClose}
      disableCancel
      disableOk
      title={'เลือกบทเรียน'}
      {...rest}
    >
      <div className="w-full">
        <div className="flex w-full flex-col">
          <div className="flex w-full gap-5">
            <div className="flex w-full flex-col gap-2">
              <p>ชั้นปี</p>
              <WCADropdown
                placeholder={selectedYear || 'เลือกชั้นปี'}
                options={years}
                onSelect={handleYearSelect}
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <p>วิชา</p>
              <WCADropdown
                placeholder={
                  filteredSubjects
                    .filter((subject) => currentSubjectIds.includes(subject.id))
                    .map((subject) => `${subject.name} `)
                    .join(', ') || 'เลือกวิชา'
                }
                options={filteredSubjects.map((d) => `${d.name} `)}
                onSelect={(selectedLabel) => {
                  const selectedSubject = filteredSubjects.find(
                    (sub) => `${sub.name} ` === selectedLabel,
                  );
                  if (selectedSubject) {
                    setCurrentSubjectIds([selectedSubject.id]);
                    fetchLessons([selectedSubject.id], 1);
                  }
                }}
                disabled={!selectedYear}
              />
            </div>
          </div>

          <div className="flex w-full flex-col">
            <div className="mt-5 max-h-[calc(100vh-300px)] overflow-y-auto md:max-h-[470px]">
              {fetching ? (
                <div className="flex h-56 w-full justify-center">
                  <span className="m-auto mb-10 inline-block h-12 w-12 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
                </div>
              ) : lessons.length === 0 ? (
                <div className="mt-10 flex items-center justify-center text-gray-500">
                  ไม่มีข้อมูล
                </div>
              ) : (
                <>
                  {mode === 'multiple' && (
                    <label className="mb-2 flex w-full items-center gap-2 bg-neutral-100 px-3 md:px-5">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        onChange={() => handleCheckboxChange()}
                        checked={allSelected}
                      />
                      <div className="grid w-full grid-cols-3 p-2 text-sm md:grid-cols-4 md:p-[10px] md:px-4 md:text-base">
                        <div>รหัส</div>
                        <div>บทที่</div>
                        <div className="hidden md:block">ชื่อบทเรียน</div>
                        <div className="md:hidden">ชื่อบทเรียน</div>
                      </div>
                    </label>
                  )}
                  {mode === 'single' && (
                    <label className="mb-2 flex w-full items-center gap-2 bg-neutral-100 px-3 md:px-5">
                      <div className="grid w-full grid-cols-3 p-2 text-sm md:grid-cols-4 md:p-[10px] md:px-4 md:text-base">
                        <div>รหัส</div>
                        <div>บทที่</div>
                        <div className="hidden md:block">ชื่อบทเรียน</div>
                        <div className="md:hidden">ชื่อบทเรียน</div>
                      </div>
                    </label>
                  )}

                  {lessons.map((lesson, index) => (
                    <div
                      key={index}
                      className={cn(
                        'mt-1 flex w-full items-center gap-2 md:mt-3 md:gap-3',
                        mode === 'single' ? 'cursor-pointer' : '',
                      )}
                      onClick={() => mode === 'single' && handleLessonClick(lesson)}
                    >
                      {mode === 'multiple' && (
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="form-checkbox"
                            onChange={() => handleCheckboxChange(lesson)}
                            checked={selectedLessons.some(
                              (s) => s.lesson_id === lesson.lesson_id,
                            )}
                          />
                        </label>
                      )}
                      <div
                        className={cn(
                          'form-input grid h-10 w-full grid-cols-3 gap-2 p-2 text-sm !font-normal hover:cursor-pointer hover:border-primary md:grid-cols-4 md:p-[10px] md:px-4 md:text-base',
                          selectedLessons.some((s) => s.lesson_id === lesson.lesson_id)
                            ? '!border-2 !border-primary'
                            : 'border-gray-300',
                        )}
                      >
                        <div>{lesson.lesson_id}</div>
                        <div>{lesson.lesson_index}</div>
                        <div className="truncate">{lesson.name}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="mt-3 w-full px-5 md:mt-5 md:px-0">
              {totalPages > 0 && (
                <CWPagination
                  currentPage={pagination.page}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={pagination.limit}
                  setPageSize={setPageSize}
                />
              )}
            </div>
          </div>

          <div className="mt-3 flex w-full justify-between gap-3 md:mt-5 md:gap-5">
            <button
              onClick={onClose}
              className="btn btn-outline-primary flex w-[120px] gap-2 md:w-[150px]"
            >
              ย้อนกลับ
            </button>
            <button
              onClick={() => {
                onSelect(selectedLessons);
                (
                  StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
                ).setLessonData(selectedLessons);
                onClose();
              }}
              className="btn btn-primary w-[120px] md:w-[150px]"
              disabled={selectedLessons.length === 0}
            >
              {mode === 'single' ? 'เลือก' : `เลือก (${selectedLessons.length})`}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalSelectLesson;
