// Import your modal component
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import ModalQuestion from '../../../../local/components/modal/ModalQuestion';
import Select from '@core/design-system/library/component/web/Select';
import Input from '@core/design-system/library/component/web/Input';
import { optionYear } from '@domain/g03/g03-d06/local/options';
import IconArrowUp from '@core/design-system/library/component/icon/IconArrowUp';
import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import CWSelect from '@component/web/cw-select';
import CWInput from '@component/web/cw-input';
import CWSelectValue from '@component/web/cw-selectValue';
import CWModalQuestionView from '@component/web/cw-modal/cw-modal-question-view';
import { LessonListItem } from '../../../../local/type';
import API from '../../../../local/api';

interface SelectLessonProps {
  templateName: string;
  setTemplateName: (name: string) => void;
  selectedLesson: number | null;
  setSelectedLesson: (id: number | null) => void;
  setSelectedLevels: (levels: number[]) => void;
  selectedLevels: number[];
  isLoading?: boolean;
}

const SelectLesson = ({
  templateName,
  setTemplateName,
  selectedLesson,
  setSelectedLesson,
  setSelectedLevels,
  selectedLevels,
  isLoading,
}: SelectLessonProps) => {
  // แทนที่ dataTier ด้วยโครงสร้างข้อมูลใหม่
  const [subLessons, setSubLessons] = useState<any[]>([]);
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { subjectId } = useParams({ strict: false });

  // เพิ่ม state สำหรับเก็บข้อมูล accordion
  const [openAccordions, setOpenAccordions] = useState<boolean[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [selectedYear, setSelectedYear] = useState('');

  // ดึงข้อมูลบทเรียนจาก API
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        // สมมติว่าเราใช้ subject_id = 1 สำหรับตัวอย่าง
        const response = await API.teacherHomework.GetLessonList(1);
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
  }, []);

  // ดึงข้อมูลบทเรียนย่อยเมื่อเลือกบทเรียนหลัก
  useEffect(() => {
    const fetchSubLessons = async () => {
      if (!selectedLesson) return;

      try {
        setLoading(true);
        // สมมติว่าเรามี API สำหรับดึงข้อมูลบทเรียนย่อย
        const response = await API.teacherHomework.GetSubLessonList(selectedLesson);
        if (response.status_code === 200) {
          setSubLessons(response.data);
          // สร้าง state สำหรับ accordion ตามจำนวนบทเรียนย่อย
          setOpenAccordions(new Array(response.data.length).fill(false));

          // สร้าง state สำหรับเก็บสถานะ checkbox
          const initialCheckedState: Record<number, boolean> = {};
          response.data.forEach((subLesson: any) => {
            subLesson.level.forEach((level: any) => {
              initialCheckedState[level.level_id] = false;
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

  // อัปเดต useEffect เพื่อตั้งค่า checkbox ตาม selectedLevels
  useEffect(() => {
    if (selectedLevels.length > 0 && subLessons.length > 0) {
      const newCheckedItems: Record<number, boolean> = {};

      // ตั้งค่าเริ่มต้นให้ทุก checkbox เป็น false
      subLessons.forEach((subLesson: any) => {
        subLesson.level.forEach((level: any) => {
          newCheckedItems[level.level_id] = false;
        });
      });

      // ตั้งค่า checkbox ที่ถูกเลือกเป็น true
      selectedLevels.forEach((levelId) => {
        if (levelId in newCheckedItems) {
          newCheckedItems[levelId] = true;
        }
      });

      setCheckedItems(newCheckedItems);
    }
  }, [selectedLevels, subLessons]);

  // แปลงข้อมูลให้ตรงกับ format ที่ต้องการ
  const mappedOptions = lessons.map((lesson) => ({
    value: lesson.id,
    label: lesson.lesson_name,
  }));

  const handleYearChange = (value: any) => {
    console.log('Selected Year:', value);
    setSelectedYear(value);
  };

  const handleLessonChange = (value: any) => {
    console.log('Selected Lesson:', value);
    setSelectedLesson(Number(value));
  };
  const toggleAccordion = (index: number) => {
    setOpenAccordions((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleCheckboxChange = (levelId: number) => {
    setCheckedItems((prevItems) => {
      const updatedItems = { ...prevItems };
      updatedItems[levelId] = !updatedItems[levelId];

      // อัปเดต selectedLevels ตาม checkbox ที่เลือก
      const selectedIds = Object.entries(updatedItems)
        .filter(([_, isChecked]) => isChecked)
        .map(([id, _]) => Number(id));

      setSelectedLevels(selectedIds);

      return updatedItems;
    });
  };
  const openModal = (id: number) => {
    setSelectedId(id);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  // แปลงระดับความยากเป็นภาษาไทย
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

  // แปลงระดับความยากเป็น CSS class
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-300';
      case 'medium':
        return 'bg-yellow-300';
      case 'hard':
        return 'bg-red-300';
      default:
        return 'bg-emerald-300';
    }
  };

  return (
    <div className="w-full">
      <div className="w-full bg-white p-5">
        <div className="mb-10 mt-5">
          <h1 className="text-[24px] font-bold">ข้อมูลการบ้าน</h1>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-5">
          <CWInput
            placeholder="ชื่อการบ้าน"
            required={true}
            className="col-span-1"
            label={'ชื่อการบ้าน'}
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
          <CWSelectValue
            options={mappedOptions}
            className="col-span-1"
            value={selectedLesson?.toString() || ''}
            onChange={handleLessonChange}
            label={'บทเรียนหลัก'}
            title="เลือกบทเรียนหลัก"
          />
        </div>
      </div>
      <div className="mt-5 w-full bg-white p-5">
        <div className="w-full">
          <h1 className="py-5 text-[20px] font-bold">บทเรียนย่อย</h1>

          {loading ? (
            <p>กำลังโหลดข้อมูล...</p>
          ) : (
            subLessons.map((subLesson, subLessonIndex) => (
              <div className="mb-5 w-full px-2" key={subLesson.sub_lesson_id}>
                <div className="flex items-center justify-between bg-gray-100 pr-4">
                  <button
                    onClick={() => toggleAccordion(subLessonIndex)}
                    className="flex gap-1 bg-gray-100 px-4 py-2 font-bold"
                  >
                    {openAccordions[subLessonIndex] ? (
                      <span className="mr-2">
                        <IconArrowDown />
                      </span>
                    ) : (
                      <span className="mr-2">
                        <IconArrowUp />
                      </span>
                    )}
                    {subLesson.sub_lesson_name}
                  </button>
                  <p>ด่าน {subLesson.sub_lesson_index}</p>
                </div>

                {openAccordions[subLessonIndex] && (
                  <div className="mt-3 bg-gray-50 p-4">
                    {/* จัดกลุ่มระดับตามความยาก */}
                    {['easy', 'medium', 'hard'].map((difficulty) => {
                      const levelsWithDifficulty = subLesson.level.filter(
                        (level: any) => level.level_difficulty === difficulty,
                      );

                      if (levelsWithDifficulty.length === 0) return null;

                      return (
                        <div key={difficulty}>
                          <p
                            className={`w-full ${getDifficultyClass(difficulty)} px-0.5 py-0.5`}
                          >
                            {getDifficultyText(difficulty)}
                          </p>
                          <div className="flex justify-around gap-5 py-5">
                            {levelsWithDifficulty.map((level: any) => (
                              <div className="flex" key={level.level_id}>
                                <input
                                  type="checkbox"
                                  checked={checkedItems[level.level_id] || false}
                                  onChange={() => handleCheckboxChange(level.level_id)}
                                  className="mr-2 hover:cursor-pointer"
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
            levelId={selectedId ?? 2}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectLesson;
