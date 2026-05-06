import { FC } from 'react';

const IconSearch: FC<{ className?: string }> = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.9 16.5C12.4346 16.5 15.3 13.366 15.3 9.5C15.3 5.63401 12.4346 2.5 8.9 2.5C5.36538 2.5 2.5 5.63401 2.5 9.5C2.5 13.366 5.36538 16.5 8.9 16.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 17.5L13.875 13.875"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconSearch;
