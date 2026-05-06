import CWInputSearch from '@component/web/cw-input-search';
import { FormEvent } from 'react';

type SearchBoxProps = {
  onSubmit?: (value?: string) => void;
};

const SearchBox = ({ onSubmit }: SearchBoxProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const searchText = formData.get('search-box');

    onSubmit?.(searchText?.toString() ?? undefined);
  };
  return (
    <form onSubmit={handleSubmit}>
      <CWInputSearch name="search-box" className="w-[250px]" placeholder="ค้นหา" />
    </form>
  );
};

export default SearchBox;
