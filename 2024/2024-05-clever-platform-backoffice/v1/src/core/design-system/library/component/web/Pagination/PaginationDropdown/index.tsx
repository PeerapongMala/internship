const PAGE_SIZES = [10, 20, 50, 100];

const PaginationDropdown = ({
  pageSize,
  setPageSize,
}: {
  pageSize: number;
  setPageSize: (size: number) => void;
}) => {
  return (
    <div className="flex items-center pl-2">
      <div className="relative w-[70px]">
        <select
          id="page-size-select"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="form-select"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size} className="font-noto-sans-thai">
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PaginationDropdown;
