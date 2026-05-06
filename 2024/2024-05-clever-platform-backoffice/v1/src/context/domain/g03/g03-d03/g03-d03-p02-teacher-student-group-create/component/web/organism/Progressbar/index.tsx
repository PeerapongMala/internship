import React from 'react';

interface ProgressBarProps {
  score: number;
  total: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ score, total, className }) => {
  const percentage = (score / total) * 100;

  return (
    <div className={`w-[80px] rounded-full bg-gray-200 ${className}`}>
      <div
        className="rounded-full bg-green-600 p-1 text-center leading-none text-blue-100"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
