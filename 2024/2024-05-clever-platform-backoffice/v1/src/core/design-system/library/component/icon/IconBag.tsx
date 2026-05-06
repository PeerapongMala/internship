import { FC } from 'react';

const IconBag: FC<{ className?: string }> = ({ className }: { className?: string }) => {
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
        d="M16.668 5.83301H3.33464C2.41416 5.83301 1.66797 6.5792 1.66797 7.49967V15.833C1.66797 16.7535 2.41416 17.4997 3.33464 17.4997H16.668C17.5884 17.4997 18.3346 16.7535 18.3346 15.833V7.49967C18.3346 6.5792 17.5884 5.83301 16.668 5.83301Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3346 17.5V4.16667C13.3346 3.72464 13.159 3.30072 12.8465 2.98816C12.5339 2.67559 12.11 2.5 11.668 2.5H8.33464C7.89261 2.5 7.46869 2.67559 7.15612 2.98816C6.84356 3.30072 6.66797 3.72464 6.66797 4.16667V17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconBag;
