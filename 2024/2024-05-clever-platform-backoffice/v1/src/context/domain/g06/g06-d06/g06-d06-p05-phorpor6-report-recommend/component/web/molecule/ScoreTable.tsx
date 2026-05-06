import { Text } from '@mantine/core';

interface ScoreTableColumn {
  header: string;
  accessor: string;
}

interface ScoreTableProps {
  columns: ScoreTableColumn[];
  data: Record<string, any>[];
  className?: string;
}

const ScoreTable: React.FC<ScoreTableProps> = ({ columns, data, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="border border-gray-200 bg-gray-100 p-3">
                <Text key={index} className="text-center" size="sm" fw={700}>
                  {column.header}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="border border-gray-200 p-3">
                  <Text className="text-center" size="sm" fw={400}>
                    {row[column.accessor]}
                  </Text>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
