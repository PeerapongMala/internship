import { useEffect, useState } from 'react';
import CWMTableCheckbox from '../../molecule/cw-m-table-checkbox';

interface CWOCheckboxGroupsProps {
  rows: Record<string, any>[];
  keys: string[];
  onRowSelect?: (rows: Record<string, any>[]) => void;
}

const CWOCheckboxGroups = function (props: CWOCheckboxGroupsProps) {
  const [selectedIndexes, setSelectedIndexes] = useState([] as number[]);

  useEffect(() => {
    setSelectedIndexes([]);
  }, [props.rows]);

  useEffect(() => {
    props.onRowSelect?.(props.rows.filter((_, index) => selectedIndexes.includes(index)));
  }, [selectedIndexes]);

  function toggleSelectIndex(index: number) {
    setSelectedIndexes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((p) => p != index);
      } else {
        return [...prev, index];
      }
    });
  }

  return (
    <table>
      <tbody>
        {props.rows.map((row, index) => {
          return (
            <tr
              className="border-b-0"
              key={`checkbox-option-${index}`}
              onClick={() => toggleSelectIndex(index)}
            >
              <td className="!p-0">
                <CWMTableCheckbox
                  checked={selectedIndexes.includes(index)}
                  onChange={() => toggleSelectIndex(index)}
                />
              </td>
              {props.keys.map((key, kIndex) => (
                <td
                  key={`label-option-${index}-${kIndex}-${key}`}
                  className="!px-0 !py-1"
                >
                  <div
                    className={`border-y-[1px] p-2 ${kIndex == 0 ? 'rounded-s-md border-s-[1px]' : kIndex == props.keys.length - 1 ? 'rounded-e-md border-e-[1px]' : ''}`}
                  >
                    {row[key]}
                  </div>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CWOCheckboxGroups;
