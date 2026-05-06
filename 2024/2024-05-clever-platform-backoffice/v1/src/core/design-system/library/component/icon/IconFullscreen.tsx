import { FC } from 'react';

const IconFullscreen: FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 4H10V2H2V10H4V4ZM14 2V4H20V10H22V2H14ZM20 20H14V22H22V14H20V20ZM4 14H2V22H10V20H4V14Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconFullscreen;
