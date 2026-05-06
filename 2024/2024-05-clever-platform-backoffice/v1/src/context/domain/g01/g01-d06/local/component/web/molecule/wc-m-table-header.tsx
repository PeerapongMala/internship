import TableCheckbox from './wc-m-table-check-box';

interface TableHeaderProps {
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
      btnLabel: string | React.ReactNode;
      onClick?: (row: Record<string, any>, rowIndex: number) => void;
    });
type ColumnBase = {
  label: string;
  className?: string;
};

export function toColumn(column: string | Column): Column {
  if (typeof column == 'string') return { label: column };
  return column;
}

const TableHeader = function ({ columns, ...props }: TableHeaderProps) {
  return (
    <thead className={`${props.className ?? ''}`}>
      <tr className={`${props.trClassName ?? ''}`}>
        {props.selectable && (
          <th className="w-1 whitespace-nowrap !p-3 text-center">
            <TableCheckbox
              group={props.group}
              onChange={(e) => {
                props.onSelect?.(e);
              }}
              checked={props.selectedAll ?? false}
            />
          </th>
        )}
        {Object.keys(columns).map((key, index) => {
          const col = toColumn(columns[key]);
          return (
            <th key={`${key}-${index}`} className={`${col.className ?? ''}`}>
              {col.label}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
