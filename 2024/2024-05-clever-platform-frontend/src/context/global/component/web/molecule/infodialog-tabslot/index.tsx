import { useTranslation } from 'react-i18next';

import ConfigJson from '@domain/g03/g03-d06/g03-d06-p01-mailbox/config/index.json';

interface TabbarSlotsProps {
  fixedwitdh: string;
  selectedTab: boolean;
  KeyZIndex: number;
  backgroundImage: string; // Add backgroundImage prop
  onTabClick: (stateflow: number) => void;
  // Add other props here
}

const WCATabbarSlot: React.FC<TabbarSlotsProps> = ({
  fixedwitdh,
  KeyZIndex,
  selectedTab,
  backgroundImage,
  onTabClick,
}) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const TabbarTemplate: React.CSSProperties = {
    width: fixedwitdh || '33.333%',
    height: '100%',
    position: 'relative',
    borderRadius: 2,
    backgroundImage: backgroundImage,
    borderBottom: (selectedTab ? 6 : 2) + 'px solid var(--rainbow-yellow, #FCD401)',
    opacity: selectedTab ? 1 : 0.5,
  };

  return (
    <div
      className="insect-0 bg-center bg-cover cursor-pointer"
      style={TabbarTemplate}
      onClick={() => {
        onTabClick(KeyZIndex);
      }}
    ></div>
  );
};

export default WCATabbarSlot;
