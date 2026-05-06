import { FC } from 'react';

export interface ButtonPaginationTextProps {
  text: string;
}

const CWAButtonPaginationText: FC<ButtonPaginationTextProps> = ({ text }) => {
  return (
    <button
      type="button"
      className="flex justify-center rounded-full bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-primary hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary"
    >
      {text}
    </button>
  );
};

export default CWAButtonPaginationText;
