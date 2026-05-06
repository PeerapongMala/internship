import { FC } from 'react';

const Icon20: FC<{ className?: string }> = ({ className }: { className?: string }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="20" height="20" fill="#D9D9D9" />
    </svg>
  );
};

export default Icon20;
