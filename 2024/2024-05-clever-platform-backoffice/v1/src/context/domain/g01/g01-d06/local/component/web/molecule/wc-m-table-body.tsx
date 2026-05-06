import { useEffect } from 'react';
import TableCheckbox from './wc-m-table-check-box';
import { Columns, toColumn } from './wc-m-table-header';
import Button from '../atom/wc-a-button';

interface CWMTableBodyProps {
  columns: Columns;
  rows: Record<string, any>[];
  className?: string;
  trClassName?: string;
  selectable?: boolean;
  type?: 'button' | 'text';
  onSelect?: (
    e: React.ChangeEvent<HTMLInputElement>,
    row: Record<string, any>,
    rowIndex: number,
  ) => void;
  selectedIndexRows: number[];
  group: string;
}

const TableBody = function ({ columns, rows, ...props }: CWMTableBodyProps) {
  return (
    <tbody className={`${props.className ?? ''}`}>
      {rows.map((row, rIndex) => (
        <tr key={`row-${rIndex}`} className={`${props.trClassName ?? ''}`}>
          {props.selectable && (
            <td className="!p-0">
              <TableCheckbox
                group={props.group}
                checked={props.selectedIndexRows.includes(rIndex)}
                onChange={(e) => {
                  props.onSelect?.(e, row, rIndex);
                }}
              />
            </td>
          )}
          {Object.keys(columns).map((key, cIndex) => {
            const col = toColumn(columns[key]);
            let content: string | React.ReactNode = row[key];
            if (col.type == 'button') {
              content = (
                <Button
                  onClick={() => col.onClick?.(row, rIndex)}
                  className="btn-white w-full !rounded-none !border-0 !bg-transparent !p-0 !shadow-none *:text-black"
                >
                  {col.btnLabel}
                </Button>
              );
            }
            return (
              <td key={`row-${rIndex}-${cIndex}`} className={`${col.className ?? ''}`}>
                {content}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
