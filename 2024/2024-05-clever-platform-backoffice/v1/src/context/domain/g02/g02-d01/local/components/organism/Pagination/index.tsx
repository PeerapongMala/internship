import { Fragment, useEffect, useState } from 'react';
import IconArrowLeft from '@core/design-system/library/component/icon/IconArrowLeft';
import IconArrowRight from '@core/design-system/library/component/icon/IconArrowRight';
import IconCaretsDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretsDown';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex items-center">
    <ul className="m-auto inline-flex items-center gap-1 rtl:space-x-reverse">
      {currentPage !== 1 && (
        <li>
          <button
            onClick={() => onPageChange(1)}
            className="rounded-full bg-white-light p-2 text-dark hover:bg-primary hover:text-white"
          >
            <IconCaretsDown className="rotate-90" />
          </button>
        </li>
      )}
      <li>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`rounded-full p-2 ${currentPage === 1 ? 'cursor-not-allowed bg-white-light text-dark' : 'bg-white-light text-dark hover:bg-primary hover:text-white'}`}
        >
          <IconArrowLeft />
        </button>
      </li>
      {[...Array(totalPages)].map((_, index) => (
        <li key={index}>
          <button
            onClick={() => onPageChange(index + 1)}
            className={`size-[36px] rounded-full ${
              currentPage === index + 1
                ? 'bg-primary text-white'
                : 'bg-white-light text-dark hover:bg-primary hover:text-white'
            }`}
          >
            {index + 1}
          </button>
        </li>
      ))}
      <li>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`rounded-full p-2 ${currentPage === totalPages ? 'cursor-not-allowed bg-white-light text-dark' : 'bg-white-light text-dark hover:bg-primary hover:text-white'}`}
        >
          <IconArrowRight />
        </button>
      </li>
      {currentPage !== totalPages && (
        <li>
          <button
            onClick={() => onPageChange(totalPages)}
            className="rounded-full bg-white-light p-2 text-dark hover:bg-primary hover:text-white"
          >
            <IconCaretsDown className="-rotate-90" />
          </button>
        </li>
      )}
    </ul>
  </div>
);

export default Pagination;
