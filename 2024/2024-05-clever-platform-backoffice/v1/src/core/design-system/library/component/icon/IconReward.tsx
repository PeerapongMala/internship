import { FC } from 'react';

const IconReward: FC<{ className?: string }> = ({
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
        d="M10.0013 12.4997C13.223 12.4997 15.8346 9.888 15.8346 6.66634C15.8346 3.44468 13.223 0.833008 10.0013 0.833008C6.77964 0.833008 4.16797 3.44468 4.16797 6.66634C4.16797 9.888 6.77964 12.4997 10.0013 12.4997Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.84036 11.5747L5.83203 19.1664L9.9987 16.6664L14.1654 19.1664L13.157 11.5664"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconReward;
