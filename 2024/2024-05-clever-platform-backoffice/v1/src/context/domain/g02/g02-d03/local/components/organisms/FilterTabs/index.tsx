import React from 'react';

interface FilterTabsProps {
  label: string;
  filterType: string;
  filterValue: string;
  activeFilter: string;
  onClick: (filterType: string, filterValue: string) => void;
}

const FilterTabs = ({
  label,
  filterType,
  filterValue,
  activeFilter,
  onClick,
}: FilterTabsProps) => {
  return (
    <button
      onClick={() => onClick(filterType, filterValue)}
      className={`border-primary px-5 py-2 hover:border-b-2 hover:text-primary ${activeFilter === filterValue ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
    >
      {label}
    </button>
  );
};

export default FilterTabs;
