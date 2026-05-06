import IconArrowLeft from '@core/design-system/library/component/icon/IconArrowLeft';
import IconArrowRight from '@core/design-system/library/component/icon/IconArrowRight';
import IconCaretsDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretsDown';

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  // คำนวณช่วงหมายเลขหน้าที่จะแสดง (แสดง 5 หมายเลข)
  const getPageRange = () => {
    const range = [];
    const start = Math.max(1, currentPage - 2); // เริ่มจากหน้าก่อน currentPage 2 หน้า
    const end = Math.min(totalPages, currentPage + 2); // จบที่หลัง currentPage 2 หน้า

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // ตรวจสอบถ้าจำนวนปุ่มน้อยกว่า 5 ให้เติมปุ่มทางซ้ายหรือขวา
    while (range.length < 5 && range[0] > 1) range.unshift(range[0] - 1); // เติมด้านซ้าย
    while (range.length < 5 && range[range.length - 1] < totalPages)
      range.push(range[range.length - 1] + 1); // เติมด้านขวา

    return range;
  };

  const pageRange = getPageRange();

  return (
    <ul className="m-auto inline-flex items-center gap-1 rtl:space-x-reverse">
      {/* ปุ่ม "ไปหน้าแรก" */}
      {currentPage > 1 && (
        <li>
          <button
            onClick={() => onPageChange(1)}
            className="rounded-full bg-white-light p-2 text-dark hover:bg-primary hover:text-white"
          >
            <IconCaretsDown className="rotate-90" />
          </button>
        </li>
      )}
      {/* ปุ่ม "ก่อนหน้า" */}
      <li>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`rounded-full p-2 ${
            currentPage === 1
              ? 'cursor-not-allowed bg-white-light text-dark'
              : 'bg-white-light text-dark hover:bg-primary hover:text-white'
          }`}
        >
          <IconArrowLeft />
        </button>
      </li>
      {/* ปุ่มหมายเลขหน้า */}
      {pageRange.map((page) => (
        <li key={page}>
          <button
            onClick={() => onPageChange(page)}
            className={`size-[36px] rounded-full ${
              currentPage === page
                ? 'bg-primary text-white'
                : 'bg-white-light text-dark hover:bg-primary hover:text-white'
            }`}
          >
            {page}
          </button>
        </li>
      ))}
      {/* ปุ่ม "ถัดไป" */}
      <li>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`rounded-full p-2 ${
            currentPage === totalPages
              ? 'cursor-not-allowed bg-white-light text-dark'
              : 'bg-white-light text-dark hover:bg-primary hover:text-white'
          }`}
        >
          <IconArrowRight />
        </button>
      </li>
      {/* ปุ่ม "ไปหน้าสุดท้าย" */}
      {currentPage < totalPages && (
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
  );
};

export default PaginationControls;
