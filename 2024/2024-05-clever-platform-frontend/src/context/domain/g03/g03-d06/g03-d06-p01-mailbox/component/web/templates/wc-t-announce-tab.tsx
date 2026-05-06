import ButtonBack from '@component/web/atom/wc-a-button-back';
import { AnnounceSlotsProps } from '@global/component/web/organism/infodialog-tab';
import { useTranslation } from 'react-i18next';
import activityIcon from '../../../assets/activityIcon.svg';
import giftIcon from '../../../assets/icon-gift.svg';
import mailboxIcon from '../../../assets/mailboxIcon.svg';
import notificationIcon from '../../../assets/notificationIcon.svg';
import ConfigJson from '../../../config/index.json';

const AnnouncementTopBar: React.CSSProperties = {
  width: 'stretch',
  height: '100px',
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'stretch',
  background: `var(--white, #ffffff)`,
  position: 'relative',
};

// Option 1: Convert to a functional component (recommended)
const AnnounceTab = (props: AnnounceSlotsProps) => {
  const { t } = useTranslation([ConfigJson.key]);

  const DisplayThing = [
    { DisplayText: t('announcement.activity'), iconPath: activityIcon },
    { DisplayText: t('announcement.mailbox'), iconPath: mailboxIcon },
    { DisplayText: t('announcement.teacher_rewards'), iconPath: giftIcon },
    { DisplayText: t('announcement.notifications'), iconPath: notificationIcon },
  ];

  return (
    <div className="inset-0 bg-cover" style={AnnouncementTopBar}>
      <div className="w-[100px] h-[stretch] pr-px pb-px rounded-tl-xl rounded-tr-sm rounded-bl-sm rounded-br-sm justify-center items-center gap-2 inline-flex">
        <ButtonBack className="!w-[65px] !h-[65px]" buttonClassName="!p-0" />
      </div>

      {DisplayThing.map((element, index) => (
        <div
          key={index}
          className="w-[340px] h-[stretch] py-2 border-b-4 border-[#fcd401] justify-center items-center gap-2 inline-flex cursor-pointer"
          onClick={() => {
            if (props.onTabClick) props.onTabClick(index);
          }}
          style={{
            borderBottom:
              (props.interfaceState?.selectedTab === index ? 6 : 2) +
              'px solid var(--rainbow-yellow, #FCD401)',
          }}
        >
          <div className="w-10 h-10 relative">
            <img
              src={element.iconPath}
              alt={`${element.DisplayText} icon`}
              className="w-full h-full"
            />
          </div>
          <div className="text-center text-[#333333] text-[20px] font-bold font-['Noto Sans Thai']">
            {element.DisplayText}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnounceTab;
