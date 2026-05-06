import { useEffect, useState } from 'react';
import PaginationButton from '../paginationbutton';
import FirstPageIcon from '../../../local/asset/icons/firstPage.svg';
import NextPageIcon from '../../../local/asset/icons/nextPage.svg';
import LastPageIcon from '../../../local/asset/icons/lastPage.svg';

interface Props {
  totalPages?: number;
  onPageChange: (pageNum: number) => void;
}

export default function PaginationRow({ totalPages = 1, onPageChange }: Props) {
  const [currentPage, setCurrentPage] = useState(1); 

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    onPageChange(pageNum);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };
  const handleFirstPage = () => {
    handlePageChange(1);
  };
  const handleLastPage = () => {
    handlePageChange(totalPages); 
  };

  const pageNumbers = [];
  const range = 2;
  const start = Math.max(1, currentPage - range);
  const end = Math.min(totalPages, currentPage + range);

  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  return totalPages > 0 ? (
    <div className="flex flex-row items-center gap-1.5">
      <button
        disabled={currentPage === 1}
        className={`flex justify-center items-center text-lg rounded-full w-10 h-10 
          ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#E0E6ED] hover:brightness-90'}`}
        onClick={handleFirstPage}
      >
        <FirstPageIcon />
      </button>
  
      <button
        disabled={currentPage === 1}
        className={`flex justify-center items-center text-lg rounded-full w-10 h-10 -rotate-180
          ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#E0E6ED] hover:brightness-90'}`}
        onClick={handlePreviousPage}
      >
        <NextPageIcon />
      </button>
  
      {pageNumbers.map((pageNum) => (
        <PaginationButton
          key={pageNum}
          pageNum={pageNum.toString()}
          selected={currentPage === pageNum}
          onSelect={() => handlePageChange(pageNum)}
          className="mx-0.5"
        />
      ))}
  
      <button
        disabled={currentPage === totalPages}
        className={`flex justify-center items-center text-lg rounded-full w-10 h-10
          ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#E0E6ED] hover:brightness-90'}`}
        onClick={handleNextPage}
      >
        <NextPageIcon />
      </button>
  
      <button
        disabled={currentPage === totalPages}
        className={`flex justify-center items-center text-lg rounded-full w-10 h-10
          ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#E0E6ED] hover:brightness-90'}`}
        onClick={handleLastPage}
      >
        <LastPageIcon />
      </button>
    </div>
  ) : null; // Return null if totalPages is 0
  
}
