import { Center, Space, Text } from '@mantine/core';
import React from 'react';

interface AssessmentSection {
  title: string;
  content?: string;
}

interface FeedbackTableProps {
  sections: AssessmentSection[];
  className?: string;
  rolename: string;
}

const FeedbackTable = ({
  sections,
  className = '',
  rolename = '',
}: FeedbackTableProps) => {
  return (
    <div className={`mx-auto w-full max-w-4xl ${className}`}>
      {/* Assessment Table */}
      <table className="w-full border-collapse border border-gray-200">
        <tbody>
          {sections.map((section, index) => (
            <tr key={index}>
              <td className="min-h-24 w-1/3 border border-gray-200 ">
                <div className="px-4 py-6 text-center  font-bold">
                  {section.title.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < section.title.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </td>
              <td className="min-h-24 w-full border border-gray-200 px-4 py-6 align-middle ">
                {section.content || <div className="border-b-2 border-dotted border-gray-400 w-full" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Signature Section */}
      <Space h="xl" />
      <Center>
        <Text fw={400} size="sm" >
          ลงชื่อ.................................................{rolename}
        </Text>
      </Center>
    </div>
  );
};

export default FeedbackTable;
