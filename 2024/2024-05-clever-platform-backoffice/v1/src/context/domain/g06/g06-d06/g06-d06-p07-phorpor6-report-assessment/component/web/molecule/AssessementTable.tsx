import { Text } from '@mantine/core';
import { Fragment } from 'react/jsx-runtime';

export interface TableSection {
  title: string;
  rows: {
    label: string;
    term1Round1: string | number;
    term1Round2: string | number;
    term2Round1: string | number;
    term2Round2: string | number;
  }[];
}

interface AssessmentTableProps {
  sections: TableSection[];
  className?: string;
}

const AssessmentTable = ({ sections, className = '' }: AssessmentTableProps) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full table-fixed border-collapse bg-white">
        {sections.map((section, sectionIndex) => (
          <Fragment key={sectionIndex}>
            {/* Section Header */}
            <thead>
              <tr>
                <th
                  rowSpan={2}
                  className="w-1/4 border border-gray-200 bg-gray-50 p-3 text-center font-medium"
                >
                  <Text fw={700} size="sm">
                    {section.title}
                  </Text>
                </th>
                <th
                  colSpan={2}
                  className="border border-gray-200 bg-gray-50 p-3 text-center font-medium"
                >
                  <Text fw={700} size="sm">
                    ภาคเรียนที่ 1
                  </Text>
                </th>
                <th
                  colSpan={2}
                  className="border border-gray-200 bg-gray-50 p-3 text-center font-medium"
                >
                  <Text fw={700} size="sm">
                    ภาคเรียนที่ 2
                  </Text>
                </th>
              </tr>
              <tr>
                <th className="border border-gray-200 bg-gray-50 p-3 text-center font-medium">
                  <Text fw={700} size="sm">
                    ครั้งที่ 1
                  </Text>
                </th>
                <th className="border border-gray-200 bg-gray-50 p-3 text-center font-medium">
                  <Text fw={700} size="sm">
                    ครั้งที่ 2
                  </Text>
                </th>
                <th className="border border-gray-200 bg-gray-50 p-3 text-center font-medium">
                  <Text fw={700} size="sm">
                    ครั้งที่ 1
                  </Text>
                </th>
                <th className="border border-gray-200 bg-gray-50 p-3 text-center font-medium">
                  <Text fw={700} size="sm">
                    ครั้งที่ 2
                  </Text>
                </th>
              </tr>
            </thead>
            {/* Section Body */}
            <tbody>
              {section.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="border border-gray-200 p-3 text-left">{row.label}</td>
                  <td className="border border-gray-200 p-3 text-center">
                    {row.term1Round1}
                  </td>
                  <td className="border border-gray-200 p-3 text-center">
                    {row.term1Round2}
                  </td>
                  <td className="border border-gray-200 p-3 text-center">
                    {row.term2Round1}
                  </td>
                  <td className="border border-gray-200 p-3 text-center">
                    {row.term2Round2}
                  </td>
                </tr>
              ))}
            </tbody>
          </Fragment>
        ))}
      </table>
    </div>
  );
};

export default AssessmentTable;
