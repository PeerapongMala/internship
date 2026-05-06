import React from 'react';

interface FilterTabsProps {
  label: string;
  filterType: string;
  filterValue: string;
  activeFilter: string;
  onClick: (filterType: string, filterValue: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  label,
  filterType,
  filterValue,
  activeFilter,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(filterType, filterValue)}
      className={`px-5 py-2 ${activeFilter === filterValue ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
    >
      {label}
    </button>
  );
};

export default FilterTabs;
