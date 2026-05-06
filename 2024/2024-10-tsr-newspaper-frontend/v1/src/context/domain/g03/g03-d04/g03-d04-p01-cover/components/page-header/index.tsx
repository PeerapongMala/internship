import { GoArrowLeft } from 'react-icons/go';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  mode?: 'add' | 'none';
}

const PageHeader: React.FC<PageHeaderProps> = ({ onBack, title, mode }: PageHeaderProps) => (
  <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center md:mb-[28px]">
    <div className="flex gap-x-[5px] items-center">
      
      {mode !== 'none' && (
        <button onClick={onBack} className='hover:cursor-pointer'>
          <GoArrowLeft size={28} className="hidden dark:block" color="#ffffff" />
          <GoArrowLeft size={28} className="dark:hidden" />
        </button>
      )}
      <p className="font-semibold text-[28px] leading-[28px] text-[#101828] dark:text-white">
        {title}
      </p>
    </div>
  </div>
);

export default PageHeader;
