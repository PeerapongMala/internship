import React from 'react';

import ImageOval from '../../../assets/oval.png';
import AnswerGroup from '../atoms/wc-a-answer-group';
import AnswerImage from '../atoms/wc-a-answer-image';

interface GroupProps {
  dataList?: Array<{ groupName: string; groupDetails: string; disabled?: boolean }>;
}

const Answer2: React.FC<GroupProps> = ({
  dataList = [
    { groupName: 'Group A', groupDetails: 'B | D', disabled: true },
    { groupName: 'Group D', groupDetails: 'B | D' },
    { groupName: 'Group D', groupDetails: 'B | D' },
    { groupName: 'Group D', groupDetails: 'B | D', disabled: true },
    // { groupName: 'Group D', groupDetails: 'B | D' },
    // { groupName: 'Group D', groupDetails: 'B | D' },
  ],
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 font-medium overflow-auto">
      {dataList.map((data, index) => (
        <AnswerGroup key={index} disabled={data.disabled}>
          <div className="flex flex-col justify-center text-center">
            <div>{data.groupName}</div>
            <div className="text-blue-500">{data.groupDetails}</div>
          </div>
        </AnswerGroup>
      ))}
      <AnswerImage id={'1'} choice="ข้อ ค." image={ImageOval} />
    </div>
  );
};

export default Answer2;
