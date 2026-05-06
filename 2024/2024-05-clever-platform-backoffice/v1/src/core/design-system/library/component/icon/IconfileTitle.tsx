import { FC } from 'react';

const IconfileTitle: FC<{ className?: string }> = ({
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
        d="M11.6673 1.66797H5.00065C4.55862 1.66797 4.1347 1.84356 3.82214 2.15612C3.50958 2.46868 3.33398 2.89261 3.33398 3.33464V16.668C3.33398 17.11 3.50958 17.5339 3.82214 17.8465C4.1347 18.159 4.55862 18.3346 5.00065 18.3346H15.0007C15.4427 18.3346 15.8666 18.159 16.1792 17.8465C16.4917 17.5339 16.6673 17.11 16.6673 16.668V6.66797L11.6673 1.66797Z"
        stroke="#525252"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.666 1.66797V6.66797H16.666"
        stroke="#525252"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3327 10.832H6.66602"
        stroke="#525252"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3327 14.168H6.66602"
        stroke="#525252"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33268 7.5H7.49935H6.66602"
        stroke="#525252"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconfileTitle;
