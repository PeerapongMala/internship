import { FC } from 'react';

const IconTrash: FC<{ className?: string }> = ({ className }: { className?: string }) => {
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
        d="M2.5 5H4.16667H17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8332 4.99935V16.666C15.8332 17.108 15.6576 17.532 15.345 17.8445C15.0325 18.1571 14.6085 18.3327 14.1665 18.3327H5.83317C5.39114 18.3327 4.96722 18.1571 4.65466 17.8445C4.3421 17.532 4.1665 17.108 4.1665 16.666V4.99935M6.6665 4.99935V3.33268C6.6665 2.89065 6.8421 2.46673 7.15466 2.15417C7.46722 1.84161 7.89114 1.66602 8.33317 1.66602H11.6665C12.1085 1.66602 12.5325 1.84161 12.845 2.15417C13.1576 2.46673 13.3332 2.89065 13.3332 3.33268V4.99935"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.3335 9.16602V14.166"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.6665 9.16602V14.166"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconTrash;
