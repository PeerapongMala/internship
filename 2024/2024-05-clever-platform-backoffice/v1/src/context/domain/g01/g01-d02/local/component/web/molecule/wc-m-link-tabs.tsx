import { Dispatch, SetStateAction } from 'react';
import TabItem from '../atom/wc-a-tab-item';
import { Link } from '@tanstack/react-router';

interface LinkTabsProps {
  tabs: { label: string; href: string; active?: boolean }[];
}

export default function LinkTabs<T>({ tabs }: LinkTabsProps) {
  return (
    <div className="flex flex-wrap border-b border-neutral-200 bg-white">
      {tabs.map((item, i) => {
        return (
          <Link to={item?.href} key={i}>
            <TabItem key={item.label} selected={item?.active}>
              {item.label}
            </TabItem>
          </Link>
        );
      })}
    </div>
  );
}
