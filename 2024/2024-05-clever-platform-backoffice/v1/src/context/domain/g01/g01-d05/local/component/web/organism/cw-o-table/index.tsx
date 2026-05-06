import CWMTableHeader, { Columns } from '../../molecule/cw-m-table-header';
import CWMTableBody from '../../molecule/cw-m-table-body';
import { useEffect, useState } from 'react';

interface CWOTableProps {
  name: string;
  columns: Columns;
  rows: Record<string, any>[];
  headerHidden?: boolean;
  theadClassName?: string;
  tbodyClassName?: string;
  className?: string;
  selectable?: boolean;
  onSelectChange?: (rows: Record<string, any>[]) => void;
}

// [NB_TODO]: ทำเรื่อง selected
const CWOTable = function ({ columns, rows, ...props }: CWOTableProps) {
  const [selectedIndexRows, setSelectedIndexRows] = useState([] as number[]);

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
      {!props.headerHidden && (
        <CWMTableHeader
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
      )}
      <CWMTableBody
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

export default CWOTable;
