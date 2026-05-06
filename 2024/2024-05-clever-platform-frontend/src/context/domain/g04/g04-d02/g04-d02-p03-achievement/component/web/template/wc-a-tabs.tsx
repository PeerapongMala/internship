import Button from '@global/component/web/atom/wc-a-button';
import ScrollableContainer from '@global/component/web/atom/wc-a-scrollable-container';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import calendarIcon from '../../../assets/calendar-todo.svg';
import checkIcon from '../../../assets/checkIcon.svg';
import PicLock from '../../../assets/lock.png';
import RestartIcon from '../../../assets/refreshIcon.svg';
import StartIcon from '../../../assets/startIcon.svg';
import PicUnLock from '../../../assets/unlock.png';
import ConfigJson from '../../../config/index.json';
import { Achievement } from '../../../type';

const Tabs = ({ achievement }: { achievement: Achievement[] }) => {
  const [activeTablist, setActiveTablist] = useState(0);
  const { t } = useTranslation([ConfigJson.key]);

  const navigate = useNavigate();

  const tabList = [
    { name: t('achievement.notReceived'), icon: calendarIcon },
    { name: t('achievement.received'), icon: checkIcon },
  ];

  const filteredAchievement = achievement.filter((data) => {
    if (activeTablist === 0) return data.received_status === false;
    if (activeTablist === 1) return data.received_status === true;
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
              <span className="ml-2 text-center text-title">{tab.name}</span>
            </div>
          </button>
        ))}
      </div>
      <ScrollableContainer className="w-full h-[500px] overflow-y-auto">
        <div className="flex flex-col gap-4 py-3 h-[450px]">
          {filteredAchievement.map((achievements, index) => {
            return (
              <div
                key={index}
                className="card-lesson p-4  border-b-2 border-white h-24 flex items-center "
              >
                <div className="w-full flex  items-center gap-5 ">
                  <div className="w-[285px] h-[70px] bg-white flex items-center justify-center relative rounded-2xl z-10 py-0.5 ">
                    {/* กรอบพื้นหลัง โล่  */}
                    <div className="w-full flex justify-center items-center pt-2 ">
                      {/* {renderBadge(achievements.template_url)} */}
                      <img
                        src={achievements.template_url || ''}
                        alt={achievements.image_url || ''}
                      />
                    </div>

                    <div className="absolute left-[45px] size-[50px]">
                      <img
                        src={achievements.image_url || ''}
                        alt={achievements.image_url || ''}
                        className="size-full "
                      />
                    </div>

                    <div className="absolute flex justify-center pl-[50px]">
                      <span className="text-[16px] font-bold text-gray-800">
                        {achievements.badge_description}
                      </span>
                    </div>
                    <div className="absolute top-[0.4px] right-0 bg-[#FCD401] rounded-tr-2xl rounded-bl-2xl">
                      <img
                        src={achievements.received_status === true ? PicUnLock : PicLock}
                        alt="lock Icon"
                        className="size-[28px] object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col pl-3">
                    <span className="text-2xl font-bold text-gray-800">
                      {achievements.badge_description}
                    </span>
                    <div className="flex items-center mt-2">
                      {/* Tag */}
                      <span className={`flex items-center text-lg py-1 rounded-full `}>
                        {`${achievements.sub_lesson_name}, ด่าน ${achievements.level_index} `}
                      </span>
                    </div>
                  </div>
                </div>
                {/* ปุ่มขวาสุด */}
                <div className="pr-10">
                  <Button
                    onClick={() => {
                      navigate({ to: `/level/${achievements.level_id}` });
                    }}
                    variant="primary"
                    width="60px"
                    height="60px"
                    className={
                      achievements.received_status === true
                        ? '*:flex *:justify-center *:items-end'
                        : ''
                    }
                  >
                    <img
                      src={
                        achievements.received_status === true ? RestartIcon : StartIcon
                      }
                      alt={
                        achievements.received_status === false
                          ? 'Button restart Icon'
                          : 'Button start Icon'
                      }
                      className={`size-10 ${achievements.received_status === true ? 'w-full mb-0.5 ms-0.5 -scale-x-100' : ''}`}
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
