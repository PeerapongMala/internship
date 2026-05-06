import { Dispatch, SetStateAction } from 'react';
import CWTabItem from '@component/web/cw-tabs/cw-tab-item';

interface TabsProps<T> {
  currentTab?: T;
  setCurrentTab: Dispatch<SetStateAction<T>>;
  tabs: { label: string; value: T }[];
}

export default function Tabs<T>({ currentTab, setCurrentTab, tabs }: TabsProps<T>) {
  return (
    <div className="flex flex-wrap border-b border-neutral-200 bg-white">
      {tabs.map((item) => {
        return (
          <CWTabItem
            selected={currentTab === item.value}
            onClick={() => setCurrentTab(item.value)}
            key={item.label}
          >
            {item.label}
          </CWTabItem>
        );
      })}
    </div>
  );
}
