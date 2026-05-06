import { FC } from 'react';

const IconMoreVertical: FC<{ className?: string }> = ({
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
        d="M9.99984 10.8332C10.4601 10.8332 10.8332 10.4601 10.8332 9.99984C10.8332 9.5396 10.4601 9.1665 9.99984 9.1665C9.5396 9.1665 9.1665 9.5396 9.1665 9.99984C9.1665 10.4601 9.5396 10.8332 9.99984 10.8332Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99984 5.00016C10.4601 5.00016 10.8332 4.62707 10.8332 4.16683C10.8332 3.70659 10.4601 3.3335 9.99984 3.3335C9.5396 3.3335 9.1665 3.70659 9.1665 4.16683C9.1665 4.62707 9.5396 5.00016 9.99984 5.00016Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99984 16.6667C10.4601 16.6667 10.8332 16.2936 10.8332 15.8333C10.8332 15.3731 10.4601 15 9.99984 15C9.5396 15 9.1665 15.3731 9.1665 15.8333C9.1665 16.2936 9.5396 16.6667 9.99984 16.6667Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconMoreVertical;
