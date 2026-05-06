import { FC } from 'react';

const IconStar: FC<{ className?: string }> = ({ className }: { className?: string }) => {
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
        d="M9.99984 1.6665L12.5748 6.88317L18.3332 7.72484L14.1665 11.7832L15.1498 17.5165L9.99984 14.8082L4.84984 17.5165L5.83317 11.7832L1.6665 7.72484L7.42484 6.88317L9.99984 1.6665Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconStar;
