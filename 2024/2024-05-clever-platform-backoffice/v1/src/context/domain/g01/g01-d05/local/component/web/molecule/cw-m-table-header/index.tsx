import CWMTableCheckbox from '../cw-m-table-checkbox';

interface CWMTableHeaderProps {
  columns: Columns;
  className?: string;
  trClassName?: string;
  selectable?: boolean;
  onSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedAll?: boolean;
  group: string;
}

export type Columns = Record<string, string | Column>;

type Column =
  | (ColumnBase & {
      type?: 'text';
    })
  | (ColumnBase & {
      type: 'button';
      btnLabel?: string | React.ReactNode;
      onBtnLabel?: (row: Record<string, any>) => string | React.ReactNode;
      onClick?: (row: Record<string, any>, rowIndex: number) => void;
    });
type ColumnBase = {
  label: string;
  className?: string;
  onShown?: () => boolean;
};

export function toColumn(column: string | Column): Column {
  if (typeof column == 'string') return { label: column };
  return column;
}

const CWMTableHeader = function ({ columns, ...props }: CWMTableHeaderProps) {
  return (
    <thead className={`${props.className ?? ''}`}>
      <tr className={`${props.trClassName ?? ''}`}>
        {props.selectable && (
          <th className="w-1 !content-center whitespace-nowrap !p-3 text-center">
            <CWMTableCheckbox
              group={props.group}
              onChange={(e) => {
                props.onSelect?.(e);
              }}
              checked={props.selectedAll ?? false}
            />
          </th>
        )}

        <th className="w-1 whitespace-nowrap !p-0">#</th>

        {Object.keys(columns).map((key, index) => {
          const col = toColumn(columns[key]);
          return (
            <>
              {(col.onShown?.() ?? true) && (
                <th
                  key={`${key}-${index}`}
                  className={`!content-center ${col.className ?? ''}`}
                >
                  {col.label}
                </th>
              )}
            </>
          );
        })}
      </tr>
    </thead>
  );
};

export default CWMTableHeader;
