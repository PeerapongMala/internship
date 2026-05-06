import { FC } from 'react';

const IconMail: FC<{ className?: string }> = ({ className }: { className?: string }) => {
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
        d="M3.33317 3.3335H16.6665C17.5832 3.3335 18.3332 4.0835 18.3332 5.00016V15.0002C18.3332 15.9168 17.5832 16.6668 16.6665 16.6668H3.33317C2.4165 16.6668 1.6665 15.9168 1.6665 15.0002V5.00016C1.6665 4.0835 2.4165 3.3335 3.33317 3.3335Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3332 5L9.99984 10.8333L1.6665 5"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconMail;
