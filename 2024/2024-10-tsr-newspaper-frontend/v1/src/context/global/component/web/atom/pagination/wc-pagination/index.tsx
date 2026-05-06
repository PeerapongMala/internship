// interface PaginationProps {
//   currentPage: number;
//   totalItems: number;
//   itemsPerPage: number;
//   onPageChange: (page: number) => void;
//   isLoading?: boolean;
// }

// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalItems,
//   itemsPerPage,
//   onPageChange,
//   isLoading = false,
// }) => {
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const firstItem = (currentPage - 1) * itemsPerPage + 1;
//   const lastItem = Math.min(currentPage * itemsPerPage, totalItems);

//   // สร้าง array ของหน้าที่จะแสดง
//   const getPageNumbers = () => {
//     const pages: (number | 'ellipsis')[] = [];

//     if (totalPages <= 7) {
//       // แสดงทุกหน้าถ้ามีน้อยกว่าหรือเท่ากับ 7 หน้า
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     }

//     pages.push(1);

//     if (currentPage > 3) {
//       pages.push('ellipsis');
//     }

//     let start = Math.max(2, currentPage - 1);
//     let end = Math.min(totalPages - 1, currentPage + 1);

//     if (currentPage <= 3) {
//       end = 4;
//     }

//     if (currentPage >= totalPages - 2) {
//       start = totalPages - 3;
//     }

//     for (let i = start; i <= end; i++) {
//       pages.push(i);
//     }

//     if (currentPage < totalPages - 2) {
//       pages.push('ellipsis');
//     }

//     pages.push(totalPages);

//     return pages;
//   };

//   const pageNumbers = getPageNumbers();

//   return (
//     <div className="flex flex-col gap-y-[14px] items-center md:items-end md:flex-row md:justify-between mt-[54px] md:mt-20">
//       <div>
//         <span className="text-sm dark:text-[#D7D7D7] leading-4 font-normal">
//           {isLoading ? (
//             <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
//           ) : (
//             `${firstItem} ถึง ${lastItem} จาก ${totalItems} รายการ`
//           )}
//         </span>
//       </div>
//       <div className="flex">
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1 || isLoading}
//           className={`border rounded-l-lg border-[#D0D5DD] dark:border-[#737373] dark:bg-[#737373] dark:text-[#D7D7D7] px-[20px] py-[13px] h-10 flex items-center justify-center transition-all duration-200 ${
//             currentPage === 1 || isLoading
//               ? 'opacity-50 cursor-not-allowed'
//               : 'hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer'
//           }`}
//         >
//           <span className="text-sm font-medium leading-[14px]">ก่อนหน้า</span>
//         </button>

//         {pageNumbers.map((pageNumber, index) =>
//           pageNumber === 'ellipsis' ? (
//             <span
//               key={`ellipsis-${index}`}
//               className="w-[34px] h-10 flex items-center justify-center border border-[#D0D5DD] dark:border-[#737373] dark:bg-[#737373] dark:text-[#D7D7D7]"
//             >
//               ...
//             </span>
//           ) : (
//             <button
//               key={pageNumber}
//               onClick={() => onPageChange(pageNumber)}
//               disabled={isLoading}
//               className={`w-[34px] h-10 flex items-center justify-center transition-all duration-200 ${
//                 currentPage === pageNumber
//                   ? 'text-white bg-[#D9A84E] transform scale-105'
//                   : 'border border-[#D0D5DD] dark:border-[#737373] dark:bg-[#737373] dark:text-[#D7D7D7] hover:bg-gray-50 dark:hover:bg-gray-600'
//               }`}
//             >
//               <span className="text-sm font-semibold leading-[14px]">{pageNumber}</span>
//             </button>
//           ),
//         )}

//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages || isLoading}
//           className={`border rounded-r-lg border-[#D0D5DD] dark:border-[#737373] dark:bg-[#737373] dark:text-[#D7D7D7] px-[20px] py-[13px] h-10 flex items-center justify-center transition-all duration-200 ${
//             currentPage === totalPages || isLoading
//               ? 'opacity-50 cursor-not-allowed'
//               : 'hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer'
//           }`}
//         >
//           <span className="text-sm font-medium leading-[14px]">ถัดไป</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Pagination;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange ,totalItems}) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage === 1) {
      return [1, 2, 3];
    } else if (currentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    } else {
      const pages = [currentPage - 1, currentPage, currentPage + 1];
      return pages.filter((page) => page >= 1 && page <= totalPages);
    }
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-between items-center mt-5">
      <div className="text-[12px] xl:text-[14px] dark:text-white">
        <span>{`${currentPage} จาก ${totalPages} หน้า (รวมทั้งหมด ${totalItems} รายการ)`}</span>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-[12px] xl:text-[14px] mx-1 bg-white dark:text-white dark:bg-[#414141] dark:hover:bg-neutral-400 hover:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-200 dark:disabled:bg-[#414141] border rounded-l-lg border-[#D0D5DD] dark:border-[#414141] px-[15px] py-[13px] h-10 flex items-center justify-center"
        >
          ก่อนหน้า
        </button>

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`text-[12px] xl:text-[14px] px-4 py-2 mx-1 rounded h-10 ${
              currentPage === page
                ? 'bg-[#D9A84E] text-white'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-[12px] xl:text-[14px] mx-1 bg-white dark:text-white dark:bg-[#414141] dark:hover:bg-neutral-400 hover:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-200 dark:disabled:bg-[#414141] border rounded-r-lg border-[#D0D5DD] dark:border-[#414141] px-[15px] py-[13px] h-10 flex items-center justify-center"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};


export default Pagination
