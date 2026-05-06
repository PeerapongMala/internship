import { Fragment, useState } from 'react';
import PaginationControls from './PaginationControl';
import PaginationDropdown from './PaginationDropdown';
import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown.tsx'; // import Index
import config from '@core/config';

interface PaginationProp {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
}

const CWPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  setPageSize,
}: PaginationProp) => {
  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
  };

  return (
    <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
      {/* Left Section - Hidden on Mobile */}
      <div className="hidden items-center gap-2 sm:flex">
        <div className="w-fit">
          <span>
            แสดง {currentPage} จาก {totalPages} หน้า
          </span>
        </div>
        <div className="w-fit">
          <WCADropdown
            placeholder={pageSize}
            options={config.pagination.itemPerPageOptions.map((size) => String(size))}
            onSelect={handlePageSizeChange}
            showTop={true}
          />
        </div>
      </div>

      {/* Right Section - Always Visible, Centered on Mobile, Right on Desktop */}
      <div className="mt-4 flex justify-center sm:mt-0 sm:justify-end">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default CWPagination;
