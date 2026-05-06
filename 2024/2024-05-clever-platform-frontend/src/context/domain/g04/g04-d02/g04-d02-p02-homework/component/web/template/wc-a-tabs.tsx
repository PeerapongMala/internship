import { useEffect, useState } from 'react';

import { Homework } from '@domain/g04/g04-d02/local/type';
import Button from '@global/component/web/atom/wc-a-button';
import ScrollableContainer from '@global/component/web/atom/wc-a-scrollable-container';
import { fromISODateToMMDDYYYY } from '@global/helper/date';
import { useOnlineStatus } from '@global/helper/online-status';
import StoreLevel from '@store/global/level';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import calendarclockIcon from '../../../assets/calendar-clock.svg';
import calendarIcon from '../../../assets/calendar-todo.svg';
import checkIcon from '../../../assets/checkIcon.svg';
import lessonIcon from '../../../assets/flower.svg';
import lateIcon from '../../../assets/lateIcon.svg';
import RestartIcon from '../../../assets/restart.svg';
import StartIcon from '../../../assets/startIcon.svg';
import ConfigJson from '../../../config/index.json';

interface Lesson {
  id: number;
  title: string;
  date: string;
  status: 'todo' | 'late' | 'complete';
  homeworkIndex: number;
  progress: number;
  total: number;
  nextLevelId: number;
  closedAt?: string;
}

const Tabs = ({ homeworks }: { homeworks: Homework[] }) => {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const today = new Date().toISOString().split('T')[0];

  const [lessons, setLessons] = useState<Lesson[]>([]);

  const getStatus = (
    date: string,
    progress: number,
    total: number,
    homeworkIndex: number
  ): 'todo' | 'late' | 'complete' => {
    const today = new Date().toISOString().split('T')[0];

    const isComplete = progress === total || homeworkIndex === 2;
    const isLate = date < today;

    if (isComplete) return 'complete';
    if (isLate) return 'late';
    return 'todo';
  };


  useEffect(() => {
    const mappedLessons = homeworks.map((homework) => ({
      id: homework.homework_id,
      homeworkIndex: homework.homework_index,
      title: homework.home_work_name,
      date: fromISODateToMMDDYYYY(homework.due_at),
      status: getStatus(
        homework.due_at,
        homework.pass_level,
        homework.total_level,
        homework.homework_index
      ),
      progress: homework.pass_level,
      total: homework.total_level,
      nextLevelId: homework.next_level_id,
      closedAt: homework.closed_at,
    }));
    setLessons(mappedLessons);
  }, [homeworks]);


  const [activeTablist, setActiveTablist] = useState(0);
  const tabList = [
    { name: t('tabs.todo'), icon: calendarIcon },
    { name: t('tabs.late'), icon: lateIcon },
    { name: t('tabs.completed'), icon: checkIcon },
  ];

  const filteredLessons = lessons.filter((lesson) => {
    if (activeTablist === 0) return lesson.status === 'todo';
    if (activeTablist === 1) return lesson.status === 'late';
    if (activeTablist === 2) return lesson.status === 'complete';
    return true;
  });

  const handleClicked = (nextLevelId: number, lessonId: number) => {
    StoreLevel.MethodGet().setHomeworkId(lessonId);
    navigate({ to: `/quiz/${nextLevelId}`, viewTransition: true });
  };

  return (
    <div>
      <div className="flex ">
        {isOnline &&
          tabList.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTablist(index)}
              className={`flex-1 flex items-center justify-center  gap-2 px-4 py-2 font-bold text-[20px]  ${activeTablist === index
                ? 'bg-white border-b-[10px] border-[#fcd401] font-bold text-[20px] '
                : 'bg-white'
                }`}
            >
              <div
                className={`flex items-center ${activeTablist === index
                  ? 'bg-white  font-bold text-[20px] '
                  : 'opacity-50'
                  }`}
              >
                <img src={tab.icon} alt={`${tab.name} icon`} className="w-8 h-8" />
                <span className="ml-2 text-center text-title">{tab.name}</span>
              </div>
            </button>
          ))}
        {!isOnline && (
          <div className="flex flex-col w-full items-center justify-between gap-6 p-4 pt-6 border-t-2 border-dashed border-secondary">
            <div className="flex flex-col items-center justify-center gap-2 text-3xl font-semibold">
              <p>คุณออฟไลน์อยู่</p>
              <p>จะไม่สามารถทำการบ้านได้</p>
              <p>กรุณาเชื่อมต่ออินเทอร์เน็ต</p>
            </div>
          </div>
        )}
      </div>
      <ScrollableContainer className="w-full h-[500px] overflow-y-auto ">
        <div className="flex flex-col gap-4 h-[400px]">
          {filteredLessons.map((lesson, index) => {
            const isLate = lesson.date < today;
            const isComplete = lesson.progress === lesson.total;

            return (
              <div
                key={index}
                className="card-lesson p-4 bg-transparent border-b-4 border-white h-24 flex justify-between items-center"
              >
                <div className="flex  items-center gap-10 pl-10">
                  <img
                    src={lessonIcon}
                    alt="Lesson Icon"
                    className="w-12 h-auto object-cover rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-[24px] font-bold text-gray-800">
                      {lesson.title}
                    </span>
                    <div className="flex items-center mt-2 ">
                      {/* Tag */}
                      <span
                        className={`flex items-center text-[18px] font-bold border-2 border-white px-2 py-1 mr-4 rounded-full ${isComplete ? 'bg-green-500' : 'bg-[#fcd401]'
                          }`}
                      >
                        {`${lesson.progress}/${lesson.total} ด่าน`}
                      </span>
                      {/* Date */}
                      <span
                        className={`flex items-center text-[18px] font-semibold ${lesson.status === 'late' ? 'text-red-600' : 'text-gray-600'
                          }`}
                      >
                        <img
                          src={calendarclockIcon}
                          alt="Calendar Icon"
                          className={`size-[28px] mr-1   ${lesson.status === 'late'
                            ? 'text-red-600'
                            : 'text-gray-600 text-[18px] font-bold'
                            }`}
                          style={{
                            filter:
                              lesson.status === 'late'
                                ? 'invert(28%) sepia(76%) saturate(5654%) hue-rotate(346deg) brightness(87%) contrast(104%)'
                                : 'none',
                          }}
                        />
                        {lesson.status === 'todo' || lesson.status === 'late'
                          ? `กำหนดส่ง: ${lesson.date}`
                          : `ส่งแล้ว: ${lesson.date}`}
                        {isLate && lesson.status === 'complete' && ' (เลยกำหนดส่ง)'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pr-10">
                  {(!lesson.closedAt || new Date(lesson.closedAt) > new Date()) && (
                    <Button
                      variant="primary"
                      width="60px"
                      height="60px"
                      onClick={() => handleClicked(lesson.nextLevelId, lesson.id)}
                    >
                      <img
                        src={lesson.status === 'complete' ? RestartIcon : StartIcon}
                        alt={
                          lesson.status === 'late'
                            ? 'Button restart Icon'
                            : 'Button start Icon'
                        }
                        className="size-10"
                      />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollableContainer>
    </div>
  );
};

export default Tabs;
