import PaginationControls from './PaginationControl';
import PaginationDropdown from './PaginationDropdown';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  disableDropdown?: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  setPageSize,
  disableDropdown = true,
}: PaginationProps) => {
  const containerClass = `flex items-center ${disableDropdown ? 'w-full justify-between' : 'justify-center'}`;

  return (
    <div className={containerClass}>
      {disableDropdown && (
        <div className="flex items-center gap-2">
          <span>
            แสดง {currentPage} จาก {totalPages} หน้า
          </span>
          <PaginationDropdown pageSize={pageSize} setPageSize={setPageSize} />
        </div>
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default Pagination;
