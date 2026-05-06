import React from 'react';

type FilterTabsProps = {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
};

const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, onFilterChange }) => (
  <div className='w-full flex border-b-[1px]'>
    <button
      onClick={() => onFilterChange('')}
      className={`px-5 py-2 ${activeFilter === "" ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
    >
      ทั้งหมด
    </button>
    <button
      onClick={() => onFilterChange('ใช้งาน')}
      className={`px-5 py-2 ${activeFilter === "ใช้งาน" ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
    >
      ใช้งาน
    </button>
    <button
      onClick={() => onFilterChange('ไม่ใช้งาน')}
      className={`px-5 py-2 ${activeFilter === "ไม่ใช้งาน" ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
    >
      ไม่ใช้งาน
    </button>
  </div>
);

export default FilterTabs;
