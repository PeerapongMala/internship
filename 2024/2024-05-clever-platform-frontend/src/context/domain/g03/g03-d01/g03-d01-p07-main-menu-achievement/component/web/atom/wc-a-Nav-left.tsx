import { useState } from 'react';

import BookIcon from '../../../assets/BookIcon.svg';
import HomeIcon from '../../../assets/HomeIcon.svg';
import StarIcon from '../../../assets/rewardicon.svg';
import TrophyIcon from '../../../assets/TrophyIcon.svg';

export function Navleft() {
  const [activeTab, setActiveTab] = useState(1);
  interface Tabs {
    icon: string;
    name: string;
  }
  const tabs: Tabs[] = [
    { icon: BookIcon, name: 'Book' },
    { icon: HomeIcon, name: 'Home' },
    { icon: TrophyIcon, name: 'Trophy' },
    { icon: StarIcon, name: 'Star' },
  ];

  return (
    <div className="w-full bg-[#ffffffc0] rounded-3xl border-[6px] border-white flex flex-col items-center">
      <div className="">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`cursor-pointer p-2 rounded-2xl ${
              activeTab === index ? 'bg-[#FCD401]' : ''
            }`}
            onClick={() => setActiveTab(index)}
          >
            <img src={tab.icon} alt={`${tab.name} icon`} className="size-[80px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Navleft;
