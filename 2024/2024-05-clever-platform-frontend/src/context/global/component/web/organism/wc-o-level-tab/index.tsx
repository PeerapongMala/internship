import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import BookIcon from '../../../../assets/BookIcon.svg';
import TrophyIcon from '../../../../assets/TrophyIcon.svg';
import StarIcon from '../../../../assets/RewardIcon.svg';

interface Tab {
  icon: string;
  name: string;
  href: string;
}

interface LevelTabProps {
  activeTabName: LevelTabNameList;
  onTabChange?: (tabName: string) => void;
  id?: string;
}

type LevelTabNameList = 'Level' | 'Homework' | 'Achievement' | 'Leaderboard';

export function LevelTab({ activeTabName, onTabChange, id }: LevelTabProps) {
  const LevelTabData: Tab[] = [
    { icon: BookIcon, name: 'Level', href: `/level/${id}` },
    // { icon: HomeworkIcon, name: 'Homework', href: '/homework/$lessonId' },
    { icon: TrophyIcon, name: 'Achievement', href: `/achievement/${id}` },
    { icon: StarIcon, name: 'Leaderboard', href: `/lesson-leaderboard/${id}` },
  ] as const;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab | undefined>(() => {
    return LevelTabData.find((tab) => tab.name === activeTabName);
  });

  const handleTabChange = (selectedTab: Tab) => {
    if (activeTab !== selectedTab) {
      const previousTab = activeTab;
      // trigger on tab change
      setActiveTab(selectedTab);
      if (onTabChange) onTabChange(selectedTab.name);
      // navigate to destination tab
      navigate({
        from: previousTab?.href,
        to: selectedTab.href,
        replace: true,
        viewTransition: true,
      });
    }
  };

  return (
    <div className="w-full bg-[#ffffffc0] rounded-3xl border-[6px] border-white flex flex-col items-center">
      {LevelTabData.map((tab, index) => (
        <div
          key={index}
          className={`cursor-pointer p-2 rounded-2xl ${
            activeTab?.name === tab.name ? 'bg-[#FCD401]' : ''
          }`}
          onClick={() => handleTabChange(tab)}
        >
          <img src={tab.icon} alt={`${tab.name} icon`} className="size-[80px]" />
        </div>
      ))}
    </div>
  );
}

export default LevelTab;
