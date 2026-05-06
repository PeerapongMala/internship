import { useEffect, useState } from 'react';
import CWAButton from '../../atom/cw-a-button';
import IconCaretsDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretsDown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';

interface CWMPaginationPageProps {
  className?: string;
  currentPage?: number;
  maxPage: number;
  onClick?: (pageNo: number) => void;
}

const CWMPaginationPage = function (props: CWMPaginationPageProps) {
  const [currentPage, setCurrentPage] = useState(props.currentPage ?? 1);

  useEffect(() => {
    setCurrentPage(props.currentPage ?? 1);
  }, [props.currentPage]);

  useEffect(() => {
    props.onClick?.(currentPage);
  }, [currentPage]);

  const btnClassName =
    'size-10 !rounded-full bg-dark-light dark:bg-dark-dark-light flex justify-center items-center';

  return (
    <div className={`flex gap-1 ${props.className ?? ''}`}>
      <CWAButton
        className={`${btnClassName} border-none !bg-dark-light !p-0 !text-black !shadow-none dark:!bg-dark-dark-light dark:!text-dark`}
        onClick={() => setCurrentPage(1)}
      >
        <IconCaretsDown className="rotate-90" duotone={false} />
      </CWAButton>
      {currentPage > 1 && (
        <button
          className={`${btnClassName}`}
          onClick={() => {
            setCurrentPage((no) => (no - 1 > 0 ? no - 1 : 1));
          }}
        >
          <IconCaretDown className="rotate-90" duotone={false} />
        </button>
      )}
      {Array(props.maxPage)
        .fill(undefined)
        .flat()
        .map((_, index) => {
          const pageNo = index + 1;
          return (
            <button
              key={`button-${index}`}
              className={`${btnClassName} ${currentPage == pageNo ? '!bg-primary text-white' : ''}`}
              onClick={() => {
                setCurrentPage(pageNo);
              }}
            >
              {pageNo}
            </button>
          );
        })}
      {currentPage < props.maxPage && (
        <button
          className={`${btnClassName}`}
          onClick={() => {
            setCurrentPage((no) => (no + 1 <= props.maxPage ? no + 1 : props.maxPage));
          }}
        >
          <IconCaretDown className="-rotate-90" duotone={false} />
        </button>
      )}
      <CWAButton
        className={`${btnClassName} border-none !bg-dark-light !p-0 !text-black !shadow-none dark:!bg-dark-dark-light dark:!text-dark`}
        onClick={() => setCurrentPage(props.maxPage)}
      >
        <IconCaretsDown className="-rotate-90" duotone={false} />
      </CWAButton>
    </div>
  );
};

export default CWMPaginationPage;
