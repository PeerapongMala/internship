import { NavFaq } from "../faq-page";

interface BreadcrumbProps {
  currentPage: NavFaq;
  onHomeClick: () => void;
  textTitle: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentPage,
  onHomeClick,
  textTitle,
}) => {
  return (
    <div className="w-full text-left mb-[28px]">
      <nav aria-label="breadcrumb" className="block w-full">
        <ol className="flex w-full flex-wrap items-center">
          <li className="flex cursor-pointer items-center text-sm font-normal leading-normal text-[#D9A84E] antialiased transition-colors duration-300 hover:text-pink-500">
            <a href="#">
              <span>ADMIN</span>
            </a>
            <span className="pointer-events-none mx-2 select-none text-black dark:text-[#9096A2]">
              /
            </span>
          </li>

          {currentPage === NavFaq.HOME ? (
            <li className="flex items-center text-sm font-normal leading-normal text-[#9096A2]">
              <span>{textTitle}</span>
            </li>
          ) : (
            <>
              <li className="flex cursor-pointer items-center text-sm font-normal leading-normal text-[#D9A84E] antialiased transition-colors duration-300 hover:text-pink-500">
                <button onClick={onHomeClick}>
                  <span>{textTitle}</span>
                </button>
                <span className="pointer-events-none mx-2 select-none text-black dark:text-[#9096A2]">
                  /
                </span>
              </li>
              <li className="flex items-center text-sm font-normal leading-normal text-[#9096A2]">
                <span>เพิ่มคำถาม</span>
              </li>
            </>
          )}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
