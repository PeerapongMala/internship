import { HtmlHTMLAttributes } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from '@tanstack/react-router';

type HeaderProps = HtmlHTMLAttributes<HTMLDivElement> & {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex w-full flex-col items-center">
      <div className="w-full">
        <div className="relative mt-[12px] flex w-full items-center">
          <div className="font-h6 w-full text-center font-noto-sans-thai font-bold text-black">
            {title}
          </div>
          <button
            className="absolute right-2 h-[20px] w-[20px] cursor-pointer text-dark"
            onClick={() => navigate({ to: '..' })}
            aria-label="Close"
          >
            <AiOutlineClose />
          </button>
        </div>
        <div className="mt-1 border-b border-gray-200 shadow-3xl"></div>
      </div>
    </div>
  );
};

export default Header;
