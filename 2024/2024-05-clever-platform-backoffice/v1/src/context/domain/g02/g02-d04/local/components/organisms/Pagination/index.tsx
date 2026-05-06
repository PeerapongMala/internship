import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, handlePageChange }: PaginationProps) => (
  <div className="pagination mt-4 flex items-center justify-center gap-1.5">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`size-10 rounded-full border ${currentPage === 1 ? 'cursor-not-allowed bg-gray-200 text-gray-400' : 'bg-slate-300 text-black'}`}
    >
      {'<<'}
    </button>

    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        onClick={() => handlePageChange(index + 1)}
        className={`size-10 rounded-full border ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-slate-300 text-black'} transition hover:bg-blue-500 hover:text-white`}
      >
        {index + 1}
      </button>
    ))}

    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`size-10 rounded-full border ${currentPage === totalPages ? 'cursor-not-allowed bg-gray-200 text-gray-400' : 'bg-slate-300 text-black'}`}
    >
      {'>>'}
    </button>
  </div>
);

export default Pagination;
