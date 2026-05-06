import { FC } from 'react';

type IconSortedProps = {
  className?: string;
};

const IconSorted: FC<{ className?: string }> = ({ className }: IconSortedProps) => {
  return (
    <svg
      className={className}
      width="8"
      height="5"
      viewBox="0 0 8 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.2"
        d="M6.64844 3.91797L3.89844 1.16797L1.14844 3.91797H6.64844Z"
        fill="#0E1726"
        stroke="#0E1726"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default IconSorted;
