import React from 'react';

interface ProgressBarProps {
  score: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ score, total }) => {
  const percentage = (score / total) * 100;

  return (
    <div className="w-[100px] bg-gray-200 rounded-full">
      <div
        className="bg-green-600  text-blue-100 text-center p-1 leading-none rounded-full"
        style={{ width: `${percentage}%` }}
      >
      </div>
    </div>
  );
};

export default ProgressBar;