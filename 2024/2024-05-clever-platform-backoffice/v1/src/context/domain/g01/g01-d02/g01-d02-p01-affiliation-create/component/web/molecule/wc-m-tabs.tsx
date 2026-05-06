import { Dispatch, SetStateAction } from 'react';
import CWTabItem from '@component/web/cw-tabs/cw-tab-item';

interface TabsProps {
  currentTab: string;
  setCurrentTab: Dispatch<SetStateAction<string>>;
  tabs: string[];
}

export default function Tabs({ currentTab, setCurrentTab, tabs }: TabsProps) {
  return (
    <div className="flex flex-wrap border-b border-neutral-200 bg-white">
      {tabs.map((item) => {
        return (
          <CWTabItem
            selected={currentTab === item}
            onClick={() => setCurrentTab(item)}
            key={item}
          >
            {item}
          </CWTabItem>
        );
      })}
    </div>
  );
}
