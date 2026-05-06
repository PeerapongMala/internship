import { FC } from 'react';

const IconFlag: FC<{ className?: string }> = ({ className }: { className?: string }) => {
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
        d="M3.3335 12.4998C3.3335 12.4998 4.16683 11.6665 6.66683 11.6665C9.16683 11.6665 10.8335 13.3332 13.3335 13.3332C15.8335 13.3332 16.6668 12.4998 16.6668 12.4998V2.49984C16.6668 2.49984 15.8335 3.33317 13.3335 3.33317C10.8335 3.33317 9.16683 1.6665 6.66683 1.6665C4.16683 1.6665 3.3335 2.49984 3.3335 2.49984V12.4998Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.3335 18.3333V12.5"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconFlag;
