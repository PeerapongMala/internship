import { Dispatch, SetStateAction } from 'react';
import TabItem from '../atom/wc-a-tab-item';

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
          <TabItem
            selected={currentTab === item.value}
            onClick={() => setCurrentTab(item.value)}
            key={item.label}
          >
            {item.label}
          </TabItem>
        );
      })}
    </div>
  );
}
