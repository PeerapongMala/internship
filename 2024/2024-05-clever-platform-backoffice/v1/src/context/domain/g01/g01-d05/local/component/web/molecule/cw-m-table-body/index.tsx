import { useEffect } from 'react';
import CWAButton from '../../atom/cw-a-button';
import CWMTableCheckbox from '../cw-m-table-checkbox';
import { Columns, toColumn } from '../cw-m-table-header';

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

const CWMTableBody = function ({ columns, rows, ...props }: CWMTableBodyProps) {
  return (
    <tbody className={`${props.className ?? ''}`}>
      {rows.map((row, rIndex) => (
        <tr key={`row-${rIndex}`} className={`${props.trClassName ?? ''}`}>
          {props.selectable && (
            <td className="!p-0">
              <CWMTableCheckbox
                group={props.group}
                checked={props.selectedIndexRows.includes(rIndex)}
                onChange={(e) => {
                  props.onSelect?.(e, row, rIndex);
                }}
              />
            </td>
          )}

          <td className="!p-0">{rIndex + 1}</td>

          {Object.keys(columns).map((key, cIndex) => {
            const col = toColumn(columns[key]);
            let content: string | React.ReactNode = row[key];
            if (col.type == 'button') {
              content = (
                <CWAButton
                  onClick={() => col.onClick?.(row, rIndex)}
                  className="btn-white w-full !rounded-none !border-0 !bg-transparent !p-0 !shadow-none *:text-black"
                >
                  {col.onBtnLabel?.(row) ?? col.btnLabel}
                </CWAButton>
              );
            }
            return (
              <>
                {(col.onShown?.() ?? true) && (
                  <td
                    key={`row-${rIndex}-${cIndex}`}
                    className={`${col.className ?? ''}`}
                  >
                    {content}
                  </td>
                )}
              </>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};

export default CWMTableBody;
