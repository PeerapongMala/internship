import CWInputSearch from '@global/component/web/cw-input-search';
import { FormEvent, useState } from 'react';

type InputSearchProps = {
  searchText: string;
  onSearchChange?: (value: string) => void;
};

const InputSearch = ({ searchText, onSearchChange }: InputSearchProps) => {
  const handleSubmitMessage = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = searchText.trim();
    if (!trimmed) return;
    onSearchChange?.(trimmed);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    onSearchChange?.(value.trim());
  };

  return (
    <form className="w-full" onSubmit={handleSubmitMessage}>
      <CWInputSearch
        name="search"
        type="text"
        placeholder="ค้นหา..."
        inputWidth="full"
        value={searchText ?? ''}
        onChange={handleInputChange}
      />
    </form>
  );
};

export default InputSearch;
