import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, handlePageChange }) => (
  <div className="pagination flex justify-center items-center space-x-2 mt-4">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`size-10 border rounded-full ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-slate-300 text-black'}`}
    >
      {"<"}
    </button>

    {Array.from({ length: totalPages }, (_, index) => (
  <button
    key={index}
    onClick={() => handlePageChange(index + 1)}
    className={`size-10 border rounded-full ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-slate-300 text-black'} hover:bg-blue-500 hover:text-white transition`}
  >
    {index + 1}
  </button>
))}


    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`size-10 border rounded-full ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-slate-300 text-black'}`}
    >
      {">"}
    </button>
  </div>
);

export default Pagination;
