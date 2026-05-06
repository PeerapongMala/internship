import { useState, useEffect, useCallback } from 'react';
import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import IconArrowRight from '@core/design-system/library/component/icon/IconArrowRight';
import CWModalQuestionView from '@component/web/cw-modal/cw-modal-question-view';
import { LessonListItem } from '../../../../local/type';
import API from '../../../../local/api';
import CWInputCheckbox from '@component/web/cw-input-checkbox';

interface SelectLevelProps {
  selectedLesson: number | null;
  setSelectedLevels: (levels: number[]) => void;
  selectedLevels: number[];
  isLoading?: boolean;
  subjectId?: number;
}

const SelectLevel = ({
  selectedLesson,
  setSelectedLevels,
  selectedLevels,
  isLoading,
  subjectId,
}: SelectLevelProps) => {
  const [subLessons, setSubLessons] = useState<any[]>([]);
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<boolean[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchLessons = async () => {
      if (isNaN(Number(subjectId))) {
        return;
      }
      try {
        setLoading(true);
        const response = await API.teacherHomework.GetLessonList(Number(subjectId));
        if (response.status_code === 200) {
          setLessons(response.data);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [subjectId]);

  useEffect(() => {
    const fetchSubLessons = async () => {
      if (!selectedLesson) {
        setSubLessons([]);
        return;
      }
      try {
        setLoading(true);
        const response = await API.teacherHomework.GetSubLessonList(selectedLesson);
        if (response.status_code === 200) {
          const fetchedSubLessons = response.data;
          setSubLessons(fetchedSubLessons);
          setOpenAccordions(new Array(fetchedSubLessons.length).fill(false));
          const initialCheckedState: Record<number, boolean> = {};
          fetchedSubLessons.forEach((subLesson: any) => {
            subLesson.level.forEach((level: any) => {
              initialCheckedState[level.level_id] = selectedLevels.includes(
                level.level_id,
              );
            });
          });
          setCheckedItems(initialCheckedState);
        }
      } catch (error) {
        console.error('Error fetching sub-lessons:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubLessons();
  }, [selectedLesson]);

  useEffect(() => {
    if (selectedLevels.length > 0 && subLessons.length > 0) {
      const newCheckedItems: Record<number, boolean> = { ...checkedItems };
      subLessons.forEach((subLesson: any) => {
        subLesson.level.forEach((level: any) => {
          if (newCheckedItems[level.level_id] === undefined) {
            newCheckedItems[level.level_id] = false;
          }
        });
      });
      selectedLevels.forEach((levelId) => {
        if (levelId in newCheckedItems) {
          newCheckedItems[levelId] = true;
        }
      });
      setCheckedItems(newCheckedItems);
    }
  }, [selectedLevels, subLessons]);

  const toggleAccordion = (index: number) => {
    setOpenAccordions((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleCheckboxChange = (levelId: number) => {
    const updatedItems = { ...checkedItems, [levelId]: !checkedItems[levelId] };
    const selectedIds = Object.entries(updatedItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([id]) => Number(id));
    setSelectedLevels(selectedIds);
    setCheckedItems(updatedItems);
  };

  const handleSelectAllInSubLesson = useCallback(
    (subLessonIndex: number) => {
      const currentSubLesson = subLessons[subLessonIndex];
      if (!currentSubLesson) return;

      const allLevelIds = currentSubLesson.level.map((l: any) => l.level_id);
      const areAllChecked = allLevelIds.every((id: number) => checkedItems[id]);
      const newCheckedState = !areAllChecked;

      const newCheckedItems = { ...checkedItems };
      allLevelIds.forEach((id: number) => {
        newCheckedItems[id] = newCheckedState;
      });

      const selectedIds = Object.entries(newCheckedItems)
        .filter(([_, isChecked]) => isChecked)
        .map(([id]) => Number(id));

      setSelectedLevels(selectedIds);
      setCheckedItems(newCheckedItems);
    },
    [subLessons, checkedItems, setSelectedLevels],
  );

  const handleSelectAllByDifficulty = useCallback(
    (subLessonIndex: number, difficulty: string) => {
      const currentSubLesson = subLessons[subLessonIndex];
      if (!currentSubLesson) return;

      const difficultyLevelIds = currentSubLesson.level
        .filter((l: any) => l.level_difficulty === difficulty)
        .map((l: any) => l.level_id);

      const areAllInDifficultyChecked = difficultyLevelIds.every(
        (id: number) => checkedItems[id],
      );
      const newCheckedState = !areAllInDifficultyChecked;

      const newCheckedItems = { ...checkedItems };
      difficultyLevelIds.forEach((id: number) => {
        newCheckedItems[id] = newCheckedState;
      });

      const selectedIds = Object.entries(newCheckedItems)
        .filter(([_, isChecked]) => isChecked)
        .map(([id]) => Number(id));

      setSelectedLevels(selectedIds);
      setCheckedItems(newCheckedItems);
    },
    [subLessons, checkedItems, setSelectedLevels],
  );

  const openModal = (id: number) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'ง่าย';
      case 'medium':
        return 'ปานกลาง';
      case 'hard':
        return 'ยาก';
      default:
        return 'ง่าย';
    }
  };

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-100';
      case 'medium':
        return 'bg-blue-100';
      case 'hard':
        return 'bg-orange-100';
      default:
        return 'bg-emerald-100';
    }
  };

  return (
    <div className="w-full">
      <div className="mt-5 w-full bg-white p-5">
        <div className="w-full">
          <h1 className="py-5 text-[20px] font-bold">บทเรียนย่อย</h1>
          {!selectedLesson ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-gray-500">โปรดเลือกบทเรียนหลัก</p>
            </div>
          ) : loading ? (
            <p> กำลังโหลดข้อมูล...</p>
          ) : (
            subLessons.map((subLesson, subLessonIndex) => (
              <div className="mb-5 w-full px-2" key={subLesson.sub_lesson_id}>
                <div className="flex items-center justify-between bg-gray-100 pr-4">
                  <button
                    onClick={() => toggleAccordion(subLessonIndex)}
                    className="flex flex-grow items-center gap-1 bg-gray-100 px-4 py-2 font-bold"
                  >
                    {openAccordions[subLessonIndex] ? (
                      <span className="mr-2">
                        <IconArrowDown />
                      </span>
                    ) : (
                      <span className="mr-2">
                        <IconArrowRight />
                      </span>
                    )}
                    {subLesson.sub_lesson_name}
                  </button>
                  <div className="flex items-center gap-2">
                    <CWInputCheckbox
                      label={` ${subLesson.level.filter(
                        (level: any) => checkedItems[level.level_id],
                      ).length
                        } / ${subLesson.level.length}`}
                      checked={
                        subLesson.level.length > 0 &&
                        subLesson.level.every(
                          (level: any) => checkedItems[level.level_id],
                        )
                      }
                      onChange={() => handleSelectAllInSubLesson(subLessonIndex)}
                      classNameInput=''
                      whiteBackground={true}
                    />
                  </div>
                </div>

                {openAccordions[subLessonIndex] && (
                  <div className="mt-3 bg-gray-50 p-4">
                    {['easy', 'medium', 'hard'].map((difficulty) => {
                      const levelsWithDifficulty = subLesson.level.filter(
                        (level: any) => level.level_difficulty === difficulty,
                      );
                      if (levelsWithDifficulty.length === 0) return null;

                      const areAllInDifficultyChecked = levelsWithDifficulty.every(
                        (level: any) => checkedItems[level.level_id],
                      );

                      const selectedInDifficulty = levelsWithDifficulty.filter(
                        (level: any) => checkedItems[level.level_id],
                      ).length;

                      const totalInDifficulty = levelsWithDifficulty.length;

                      return (
                        <div key={difficulty}>
                          <div
                            className={`flex w-full items-center justify-between gap-2 px-2 py-1 ${getDifficultyClass(difficulty)}`}
                          >
                            <span>{getDifficultyText(difficulty)}</span>

                            <CWInputCheckbox
                              label={`${selectedInDifficulty} / ${totalInDifficulty}`}
                              className=""
                              checked={areAllInDifficultyChecked}
                              onChange={() =>
                                handleSelectAllByDifficulty(subLessonIndex, difficulty)
                              }
                              whiteBackground={true}
                            />
                          </div>
                          <div className="flex flex-wrap justify-start gap-5 py-5 pl-4">
                            {levelsWithDifficulty.map((level: any) => (
                              <div className="flex items-center" key={level.level_id}>
                                <CWInputCheckbox
                                  id={`level-${level.level_id}`}
                                  checked={checkedItems[level.level_id] || false}
                                  onChange={() => handleCheckboxChange(level.level_id)}
                                  className="mr-2"
                                  whiteBackground={true}
                                />
                                <button
                                  className="text-primary underline decoration-primary"
                                  onClick={() => openModal(level.level_id)}
                                >
                                  {level.level_index}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
          <CWModalQuestionView
            open={isOpen}
            onClose={closeModal}
            levelId={selectedId ?? 0}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectLevel;
