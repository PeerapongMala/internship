import React from 'react';

interface SelectItemPageProps {
  value: number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectItemPage = ({ value, onChange }: SelectItemPageProps) => (
  <select value={value} onChange={onChange} className="form-select w-20">
    <option value="10">10</option>
    <option value="20">20</option>
    <option value="30">30</option>
  </select>
);

export default SelectItemPage;
