import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import TableHeader, { Columns } from '../molecule/wc-m-table-header';
import TableBody from '../molecule/wc-m-table-body';

interface TableProps {
  selectedIndexRows: number[];
  setSelectedIndexRows: Dispatch<SetStateAction<number[]>>;
  name: string;
  columns: Columns;
  rows: Record<string, any>[];
  theadClassName?: string;
  tbodyClassName?: string;
  className?: string;
  selectable?: boolean;
  onSelectChange?: (rows: Record<string, any>) => void;
}

const Table = function ({
  columns,
  rows,
  selectedIndexRows,
  setSelectedIndexRows,
  ...props
}: TableProps) {
  useEffect(() => {
    setSelectedIndexRows([]);
  }, [rows]);

  useEffect(() => {
    props.onSelectChange?.(selectedIndexRows.map((i) => rows[i]));
    checkCheckboxSelected();
  }, [selectedIndexRows, setSelectedIndexRows]);

  function checkCheckboxSelected() {
    const headerEl = document.querySelector(
      `[data-group='checkbox-${props.name}-header']`,
    ) as HTMLInputElement;
    const bodyEls = document.querySelectorAll(
      `[data-group='checkbox-${props.name}-item']`,
    );

    if (headerEl instanceof HTMLInputElement) {
      headerEl['checked'] = rows.length != 0 && selectedIndexRows.length == rows.length;
    }
    for (let index in bodyEls) {
      const el = bodyEls[index];
      if (el instanceof HTMLInputElement) {
        el.checked = selectedIndexRows.includes(+index);
      }
    }
  }

  return (
    <table key={rows.length} className={`table ${props.className ?? ''}`}>
      <TableHeader
        group={props.name + '-header'}
        className={props.theadClassName}
        selectable={props.selectable ?? false}
        columns={columns}
        selectedAll={selectedIndexRows.length == rows.length}
        onSelect={(e) => {
          const checked = e.target.checked;
          setSelectedIndexRows(checked ? rows.map((_, i) => i) : []);
        }}
      />
      <TableBody
        group={props.name + '-item'}
        className={props.tbodyClassName}
        selectable={props.selectable ?? false}
        columns={columns}
        rows={rows}
        selectedIndexRows={selectedIndexRows}
        onSelect={(e, _, rIndex) => {
          setSelectedIndexRows((prev) => {
            if (prev.includes(rIndex)) {
              return prev.filter((v) => v != rIndex);
            } else {
              return [...prev, rIndex];
            }
          });
        }}
      />
    </table>
  );
};

export default Table;
