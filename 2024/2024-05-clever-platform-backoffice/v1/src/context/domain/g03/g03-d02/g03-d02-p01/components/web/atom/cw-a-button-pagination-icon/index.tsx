import { ReactNode } from '@tanstack/react-router';
import { FC } from 'react';

export interface ButtonPaginationIconProps {
  children: ReactNode;
}

const CWAButtonPaginationIcon: FC<ButtonPaginationIconProps> = ({ children }) => {
  return (
    <button
      type="button"
      className="flex justify-center rounded-full bg-white-light p-2 font-semibold text-dark transition hover:bg-primary hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary"
    >
      {children}
    </button>
  );
};

export default CWAButtonPaginationIcon;
