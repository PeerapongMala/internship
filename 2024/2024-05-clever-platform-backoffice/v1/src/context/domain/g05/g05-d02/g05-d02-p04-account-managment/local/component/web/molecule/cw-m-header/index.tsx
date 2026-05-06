import { HtmlHTMLAttributes } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from '@tanstack/react-router';

type HeaderProps = HtmlHTMLAttributes<HTMLDivElement> & {
  title: string;
  onCloseClick?: () => void;
  disableCloseButton?: boolean;
};

const Header = ({ title, disableCloseButton, onCloseClick }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative my-[6.5px] flex w-full items-center">
        <div className="font-h6 w-full text-center font-noto-sans-thai font-bold text-black">
          {title}
        </div>

        {!disableCloseButton && (
          <button
            className="absolute right-2 h-[20px] w-[20px] cursor-pointer text-dark"
            onClick={onCloseClick ? onCloseClick : () => navigate({ to: '..' })}
            aria-label="Close"
          >
            {/* <AiOutlineClose /> */}
          </button>
        )}
      </div>
      <div className="w-full border-b border-gray-200 shadow-3xl"></div>
    </div>
  );
};

export default Header;
