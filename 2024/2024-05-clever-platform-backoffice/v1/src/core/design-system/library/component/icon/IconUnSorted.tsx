import { FC } from 'react';

type IconUnSortedProps = {
  className?: string;
};

const IconUnSorted: FC<{ className?: string }> = ({ className }: IconUnSortedProps) => {
  return (
    <svg
      width="12"
      height="19"
      viewBox="0 0 12 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.2"
        d="M8.64844 6.91797L5.89844 4.16797L3.14844 6.91797H8.64844Z"
        fill="#0E1726"
        stroke="#0E1726"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        opacity="0.2"
        d="M8.64844 12.082L5.89844 14.832L3.14844 12.082H8.64844Z"
        fill="#0E1726"
        stroke="#0E1726"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default IconUnSorted;
