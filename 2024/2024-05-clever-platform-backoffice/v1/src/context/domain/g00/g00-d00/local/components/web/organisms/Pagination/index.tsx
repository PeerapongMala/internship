import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, handlePageChange }: PaginationProps) => {
  const limitButton = 5;
  let startPage = Math.max(1, currentPage - Math.floor(limitButton / 2));
  let endPage = Math.min(totalPages, startPage + limitButton - 1);
  if (endPage - startPage + 1 < limitButton) {
    startPage = Math.max(1, endPage - limitButton + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination mt-4 flex items-center justify-center gap-1.5">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`size-10 rounded-full border ${currentPage === 1 ? 'cursor-not-allowed bg-gray-200 text-gray-400' : 'bg-slate-300 text-black'}`}
      >
        {'<'}
      </button>

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => handlePageChange(pageNumber)}
          className={`size-10 rounded-full border ${currentPage === pageNumber ? 'bg-primary text-white' : 'bg-slate-300 text-black'} transition hover:bg-blue-500 hover:text-white`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`size-10 rounded-full border ${currentPage === totalPages ? 'cursor-not-allowed bg-gray-200 text-gray-400' : 'bg-slate-300 text-black'}`}
      >
        {'>'}
      </button>
    </div>
  );
};

export default Pagination;
