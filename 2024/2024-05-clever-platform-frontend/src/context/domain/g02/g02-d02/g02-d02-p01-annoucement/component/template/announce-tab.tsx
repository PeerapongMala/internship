import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../../../../g03/g03-d06/g03-d06-p01-mailbox/component/web/atoms/wc-a-icon';
import closebutton from '../../assets/closebutton.svg';
import systemIcon from '../../assets/cog.svg';
import schoolIcon from '../../assets/school.svg';
import ConfigJson from '../../config/index.json';
import { AnnounceMenuState } from '../../type';

export interface AnnounceSlotsProps {
  interfaceState?: AnnounceMenuState;
  onTabClick: (stateflow: number) => void;
  onTabClose?: () => void;
  // Add other props here
}

const AnnouncementTopBar: React.CSSProperties = {
  width: 'stretch',
  height: 100,
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'stretch',
  background: `var(--white, #ffffff)`,
  position: 'relative',
};

const AnnounceTabFunc = (props: AnnounceSlotsProps) => {
  const { t } = useTranslation([ConfigJson.key]);

  const tabBarToDisplay = [
    {
      key: 0,
      backgroundImage: t('announce_from_school'),
    },
    {
      key: 1,
      backgroundImage: t('announce_from_system'),
    },
  ];

  return (
    <div className="inset-0 bg-cover" style={AnnouncementTopBar}>
      {tabBarToDisplay.map((item, index) => (
        <div
          key={index}
          className="w-[520px] h-[100px] rounded-tl-xl rounded-tr-sm rounded-bl-sm rounded-br-sm border-b-4 border-[#fcd401] justify-center items-center gap-2 inline-flex cursor-pointer"
          onClick={() => {
            props.onTabClick(item.key);
          }}
          style={{
            borderBottom:
              (props.interfaceState?.selectedTab == item.key ? 6 : 2) +
              'px solid var(--rainbow-yellow, #FCD401)',
          }}
        >
          <div className="w-12 h-12 relative">
            <Icon
              src={index == 0 ? schoolIcon : systemIcon}
              className="h-[40px] w-auto"
            />
          </div>
          <div className="text-center text-[#333333] text-2xl font-bold font-['Noto Sans Thai']">
            {item.backgroundImage}
          </div>
        </div>
      ))}
      <div className="w-20 h-20 pl-1 rounded-tl-2xl rounded-bl-2xl justify-center items-center inline-flex">
        <div className="w-8 h-8 relative cursor-pointer" onClick={props.onTabClose}>
          <img className="w-8 h-8 left-0 top-0 absolute" src={closebutton} />
        </div>
      </div>
    </div>
  );
};

export default AnnounceTabFunc;
