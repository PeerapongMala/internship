import React from 'react';

import AnswerText from '../atoms/wc-a-answer-text';

interface GroupProps {
  dataList?: Array<{ choice?: string; answer: string; disabled?: boolean }>;
}

const Answer: React.FC<GroupProps> = ({
  dataList = [
    { choice: 'A', answer: 'Ans' },
    { choice: 'B', answer: 'Ans', disabled: true },
    { choice: 'C', answer: 'Ans', disabled: true },
    { choice: 'D', answer: 'Ans' },
    { answer: 'Ans' },
    { answer: 'Ans' },
  ],
}) => {
  return (
    <>
      {dataList.map((data, index) => (
        <AnswerText
          key={index}
          choice={data.choice}
          answer={data.answer}
          disabled={data.disabled}
        />
      ))}
    </>
  );
};

export default Answer;
