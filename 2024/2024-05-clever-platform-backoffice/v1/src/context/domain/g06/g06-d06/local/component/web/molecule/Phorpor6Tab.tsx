import { TabGroup, TabList } from '@headlessui/react';
import { Text } from '@mantine/core';
import React from 'react';

interface Phorpor6Tab {
  tabs: {
    name: string;
    active: boolean;
    onClick: () => void;
  }[];
}

const Phorpor6Tab: React.FC<Phorpor6Tab> = (props) => {
  const { tabs } = props;
  return (
    <TabGroup as="div">
      <TabList className="flex h-9 w-full border-b border-neutral-200 bg-white">
        {tabs.map((tab, index) => {
          return (
            <Text
              key={index}
              onClick={tab.onClick}
              fw={400}
              size="sm"
              className={`cursor-pointer px-5 py-2.5 text-center ${tab.active ? 'border-b border-b-primary text-primary' : 'border-b border-transparent text-neutral-500'} `}
            >
              {tab.name}
            </Text>
          );
        })}
      </TabList>
    </TabGroup>
  );
};

export default Phorpor6Tab;
