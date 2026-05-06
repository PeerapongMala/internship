import CWButton from '@component/web/cw-button';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import CWInputSearch from '@component/web/cw-input-search';
import { Modal } from '@component/web/cw-modal';
import CWPagination from '@component/web/cw-pagination';
import CWSearchSelect from '@domain/g04/g04-d01/local/component/web/cw-search-select';
import CWTable, { CWTableProps } from '@domain/g04/g04-d02/local/component/web/cw-table';

interface CWSelectRecordsModalProps<T> extends CWTableProps<T> {
  open: boolean;
  title: string;
  onClose?: () => void;
  onSubmit?: () => void;
  className?: string;
  submitBtnLabel?: string;
  closeBtnLabel?: string;
  search?:
    | {
        type: 'text';
        onSearchChange(text: string): void;
      }
    | {
        type: 'select';
        key: string;
        onSearchChange(text: string): void;
        onSelectChange(text: string): void;
        options: { label: string; value: string }[];
      };
}

const CWSelectRecordsModal = function <T extends Record<string, any>>({
  open,
  title,
  className,
  onClose,
  onSubmit,
  columns,
  submitBtnLabel,
  closeBtnLabel,
  search,
  ...tableProps
}: CWSelectRecordsModalProps<T>) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      className={`w-3/4 ${className ?? ''}`}
    >
      <div className="flex flex-col gap-4">
        {search &&
          (search.type == 'select' ? (
            <CWSearchSelect
              options={search.options}
              _key={search.key}
              onSearchChange={(e) => {
                const value = e.currentTarget.value;
                search?.onSearchChange(value);
              }}
              onSelectChange={(e) => {
                const value = e.currentTarget.value;
                search?.onSelectChange(value);
              }}
            />
          ) : (
            <CWInputSearch
              className="*:w-full"
              onChange={(e) => {
                const value = e.currentTarget.value;
                search?.onSearchChange(value);
              }}
            />
          ))}
        <div className="flex flex-col gap-2">
          {tableProps.records.length ? (
            tableProps.records.map((record) => (
              <div className="flex items-center gap-3" key={record.id}>
                <div className="shrink-0">
                  <CWInputCheckbox
                    checked={tableProps.selectedRecords?.some(
                      (_record) => record.id == _record.id,
                    )}
                    onClick={(e) => {
                      const records = tableProps.selectedRecords || [];
                      tableProps.onSelectedRecordsChange?.(
                        !records.some((_record: any) => record.id == _record.id)
                          ? [...records, record]
                          : records.filter((_record: any) => record.id != _record.id),
                      );
                    }}
                  />
                </div>
                <button
                  className={`flex flex-auto gap-2 rounded-lg border px-4 py-2 text-start *:flex-1 *:shrink-0 hover:cursor-pointer ${tableProps.selectedRecords?.some((_record) => _record['id'] == record['id']) ? 'broder border-primary' : ''}`}
                  onClick={() => {
                    const records = tableProps.selectedRecords || [];
                    tableProps.onSelectedRecordsChange?.(
                      !records.some((_record: any) => record.id == _record.id)
                        ? [...records, record]
                        : records.filter((_record: any) => record.id != _record.id),
                    );
                  }}
                >
                  {columns.map((column, index) => {
                    return (
                      <div
                        key={`${column.accessor.toString()}-${index}`}
                        className={`${'className' in column ? (column.className ?? '') : ''}`}
                        onClick={() => {}}
                      >
                        {column.render?.(record, index) ??
                          (column.accessor in record
                            ? record[column.accessor.toString()]
                            : '')}
                      </div>
                    );
                  })}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center">ไม่พบข้อมูล</div>
          )}
        </div>
        {tableProps.page &&
        tableProps.onPageChange &&
        tableProps.limit &&
        tableProps.onLimitChange &&
        tableProps.totalRecords ? (
          <CWPagination
            currentPage={tableProps.page}
            onPageChange={tableProps.onPageChange}
            pageSize={tableProps.limit}
            setPageSize={tableProps.onLimitChange}
            totalPages={Math.ceil(tableProps.totalRecords / tableProps.limit)}
          />
        ) : (
          ''
        )}
        <div className="flex justify-between">
          <CWButton outline title={closeBtnLabel ?? 'ย้อนกลับ'} onClick={onClose} />
          <CWButton
            title={submitBtnLabel ?? 'เลือก'}
            disabled={!tableProps.selectedRecords?.length}
            onClick={onSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CWSelectRecordsModal;
