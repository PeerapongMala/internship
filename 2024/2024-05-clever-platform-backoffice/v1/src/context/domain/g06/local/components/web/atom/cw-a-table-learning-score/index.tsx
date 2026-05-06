import { ReactNode } from 'react';

type TableLearningScoreProps = {
  title?: string;
  rows: { header?: ReactNode; content: string }[];
};

//million-ignore
const TableLearningScore = ({
  title = 'คะแนนผลการเรียน',
  rows,
}: TableLearningScoreProps) => {
  return (
    <table className="w-fit table-fixed border-collapse border border-black">
      <thead>
        <tr>
          <th colSpan={rows.length} className="border border-black text-center">
            {title}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {rows.map((row, index) => (
            <td key={index} className="border border-black align-bottom">
              <div className="flex flex-col items-center justify-end">
                <span className="rotate-180 transform text-center [writing-mode:vertical-rl]">
                  {row.content}
                </span>
              </div>
            </td>
          ))}
        </tr>
        <tr>
          {rows.map((row, index) => (
            <td
              key={`val-${index}`}
              className="m-0 border border-black !px-2 !py-1 text-left align-top font-bold text-primary"
            >
              {row.header ?? '##'}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};
export default TableLearningScore;
