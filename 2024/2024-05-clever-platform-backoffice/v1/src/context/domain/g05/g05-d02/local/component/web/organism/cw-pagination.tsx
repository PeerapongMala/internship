import IconArrowLeft from '@core/design-system/library/component/icon/IconArrowLeft';
import IconArrowRight from '@core/design-system/library/component/icon/IconArrowRight';
import React from 'react';

interface CWPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CWPagination = ({ currentPage, totalPages, onPageChange }: CWPaginationProps) => {
  return (
    <div className="my-5 flex w-full items-center justify-between space-x-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex size-10 items-center justify-center rounded-full bg-[#E0E6ED] ${currentPage === 1 ? 'cursor-not-allowed' : 'text-black hover:bg-gray-200'}`}
      >
        <IconArrowLeft />
      </button>

      <span className="min-w-[40px] text-center">
        {currentPage}/{totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex size-10 items-center justify-center rounded-full bg-[#E0E6ED] ${currentPage === totalPages ? 'cursor-not-allowed' : 'text-black hover:bg-gray-200'}`}
      >
        <IconArrowRight />
      </button>
    </div>
  );
};

export default CWPagination;
