import { FC } from 'react';

const IconRewardItem: FC<{ className?: string }> = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.0015 14.9995C15.8675 14.9995 19.0015 11.8655 19.0015 7.99951C19.0015 4.13352 15.8675 0.999512 12.0015 0.999512C8.13547 0.999512 5.00146 4.13352 5.00146 7.99951C5.00146 11.8655 8.13547 14.9995 12.0015 14.9995Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.20854 13.8899L6.99854 22.9999L11.9985 19.9999L16.9985 22.9999L15.7885 13.8799"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconRewardItem;
