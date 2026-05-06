import { FC } from 'react';

const IconPen: FC<{ className?: string }> = ({ className }: { className?: string }) => {
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
        d="M14.1665 2.5009C14.3854 2.28203 14.6452 2.10842 14.9312 1.98996C15.2171 1.87151 15.5236 1.81055 15.8332 1.81055C16.1427 1.81055 16.4492 1.87151 16.7352 1.98996C17.0211 2.10842 17.281 2.28203 17.4998 2.5009C17.7187 2.71977 17.8923 2.97961 18.0108 3.26558C18.1292 3.55154 18.1902 3.85804 18.1902 4.16757C18.1902 4.4771 18.1292 4.7836 18.0108 5.06956C17.8923 5.35553 17.7187 5.61537 17.4998 5.83424L6.24984 17.0842L1.6665 18.3342L2.9165 13.7509L14.1665 2.5009Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconPen;
