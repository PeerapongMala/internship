interface InputSearchProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
}

const InputSearch: React.FC<InputSearchProps> = (props) => {
  const { value, placeholder, onChange, onSearch } = props;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mx-auto text-[#414141] dark:text-[#D7D7D7]"
    >
      <input
        className="border border-[#737373] h-[2.375rem] rounded-md bg-white dark:bg-[#414141] text-sm leading-5 font-normal w-[9.375rem] py-2 px-3 pr-7 focus:outline-none"
        name="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSearch) {
            onSearch(value);
          }
        }}
      />
      <button type="submit" className="absolute right-0 top-0 py-[9px] px-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="dark:hidden"
        >
          <path
            d="M9.08678 15.8333C12.7364 15.8333 15.695 12.8486 15.695 9.16667C15.695 5.48477 12.7364 2.5 9.08678 2.5C5.43713 2.5 2.47852 5.48477 2.47852 9.16667C2.47852 12.8486 5.43713 15.8333 9.08678 15.8333Z"
            stroke="#0E1726"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.3471 17.5L13.7539 13.875"
            stroke="#0E1726"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hidden dark:block"
        >
          <path
            d="M9.08678 15.8333C12.7364 15.8333 15.695 12.8486 15.695 9.16667C15.695 5.48477 12.7364 2.5 9.08678 2.5C5.43713 2.5 2.47852 5.48477 2.47852 9.16667C2.47852 12.8486 5.43713 15.8333 9.08678 15.8333Z"
            stroke="#D7D7D7"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.3471 17.5L13.7539 13.875"
            stroke="#D7D7D7"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
};

export default InputSearch;
