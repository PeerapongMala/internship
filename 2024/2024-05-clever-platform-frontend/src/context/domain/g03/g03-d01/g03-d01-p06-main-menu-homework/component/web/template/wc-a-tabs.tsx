import { useState } from 'react';

import Button from '@global/component/web/atom/wc-a-button';
import ScrollableContainer from '@global/component/web/atom/wc-a-scrollable-container';
import { useTranslation } from 'react-i18next';
import calendarclockIcon from '../../../assets/calendar-clock.svg';
import calendarIcon from '../../../assets/calendar-todo.svg';
import checkIcon from '../../../assets/checkIcon.svg';
import lessonIcon from '../../../assets/flower.svg';
import lateIcon from '../../../assets/lateIcon.svg';
import RestartIcon from '../../../assets/restart.svg';
import StartIcon from '../../../assets/startIcon.svg';
import ConfigJson from '../../../config/index.json';

const Tabs = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  interface Lesson {
    id: number;
    title: string;
    date: string;
    status: 'todo' | 'late' | 'complete';
    progress: number;
  }

  const lessons: Lesson[] = [
    {
      id: 1,
      title: 'ชื่อภารกิจการบ้าน',
      date: '2024-09-01',
      status: 'todo',
      progress: 3,
    },
    {
      id: 2,
      title: 'ชื่อภารกิจการบ้าน',
      date: '2024-08-15',
      status: 'late',
      progress: 7,
    },
    {
      id: 3,
      title: 'ชื่อภารกิจการบ้าน',
      date: '2024-09-10',
      status: 'complete',
      progress: 10,
    },
    {
      id: 4,
      title: 'ชื่อภารกิจการบ้าน',
      date: '2024-08-10',
      status: 'complete',
      progress: 10,
    },
    {
      id: 5,
      title: 'ชื่อภารกิจการบ้าน',
      date: '2024-09-05',
      status: 'todo',
      progress: 5,
    },
    {
      id: 6,
      title: 'ชื่อภารกิจการบ้าน',
      date: '2024-08-20',
      status: 'late',
      progress: 2,
    },
    {
      id: 7,
      title: 'ชื่อภารกิจการบ้าน',
      date: '2024-08-15',
      status: 'complete',
      progress: 10,
    },
    {
      id: 8,
      title: 'ชื่อภารกิจการบ้าน',
      date: '2024-09-10',
      status: 'complete',
      progress: 10,
    },
    {
      id: 9,
      title: 'ชื่อภารกิจการบ้าน',
      date: '2024-09-10',
      status: 'complete',
      progress: 10,
    },
    {
      id: 10,
      title: 'ชื่อภารกิจการบ้าน',
      date: '2024-09-10',
      status: 'complete',
      progress: 10,
    },
    {
      id: 11,
      title: 'ชื่อภารกิจการบ้าน',
      date: '2024-09-12',
      status: 'complete',
      progress: 10,
    },
    {
      id: 12,
      title: 'ชื่อภารกิจการบ้าน',
      date: '2024-09-12',
      status: 'complete',
      progress: 20,
    },
    {
      id: 13,
      title: 'ชื่อภารกิจการบ้าน',
      date: '2024-09-12',
      status: 'complete',
      progress: 20,
    },
  ];

  const [activeTablist, setActiveTablist] = useState(0);
  const tabList = [
    { name: t('tabs.todo'), icon: calendarIcon },
    { name: t('tabs.late'), icon: lateIcon },
    { name: t('tabs.completed'), icon: checkIcon },
  ];

  const today = new Date().toISOString().split('T')[0];

  const filteredLessons = lessons.filter((lesson) => {
    if (activeTablist === 0) return lesson.status === 'todo';
    if (activeTablist === 1) return lesson.status === 'late';
    if (activeTablist === 2) return lesson.status === 'complete';
    return true;
  });
  return (
    <div>
      {' '}
      <div className="flex ">
        {tabList.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTablist(index)}
            className={`flex-1 flex items-center justify-center  gap-2 px-4 py-2 font-bold text-[20px]  ${
              activeTablist === index
                ? 'bg-white border-b-[10px] border-[#fcd401] font-bold text-[20px] '
                : 'bg-white'
            }`}
          >
            <div
              className={`flex items-center ${
                activeTablist === index
                  ? 'bg-white  font-bold text-[20px] '
                  : 'opacity-50'
              }`}
            >
              <img src={tab.icon} alt={`${tab.name} icon`} className="w-8 h-8" />
              <span className="ml-2 text-center text-title">{tab.name} </span>
            </div>
          </button>
        ))}
      </div>
      <ScrollableContainer className="w-full h-[500px] overflow-y-auto ">
        <div className="flex flex-col gap-4 h-[420px]">
          {filteredLessons.map((lesson, index) => {
            const isLate = lesson.date < today;
            const isComplete = lesson.progress === 10;

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
                      <span
                        className={`flex items-center text-[18px] font-bold border-2 border-white px-2 py-1 mr-4 rounded-full ${
                          isComplete ? 'bg-green-500' : 'bg-[#fcd401]'
                        }`}
                      >
                        {`${lesson.progress}/10 ${t('lesson.stages')}`}
                      </span>
                      <span
                        className={`flex items-center text-[18px] font-semibold ${
                          lesson.status === 'late' ? 'text-red-600' : 'text-gray-600'
                        }`}
                      >
                        <img
                          src={calendarclockIcon}
                          alt="Calendar Icon"
                          className={`size-[28px] mr-1   ${
                            lesson.status === 'late'
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
                          ? `${t('lesson.dueDate')}: ${lesson.date}`
                          : `${t('lesson.submitted')}: ${lesson.date}`}
                        {isLate &&
                          lesson.status === 'complete' &&
                          ` (${t('lesson.pastDue')})`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pr-10">
                  <Button variant="primary" width="60px" height="60px">
                    <img
                      src={lesson.status === 'complete' ? RestartIcon : StartIcon}
                      alt={
                        lesson.status === 'late' ? t('button.restart') : t('button.start')
                      }
                      className="size-10"
                    />
                  </Button>
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
