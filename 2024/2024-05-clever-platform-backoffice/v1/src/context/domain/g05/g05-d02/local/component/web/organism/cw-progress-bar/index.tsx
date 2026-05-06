interface ProgressBarProps {
  score: number;
  total: number;
  className?: string;
}

const CWProgressBar = ({ score, total, className }: ProgressBarProps) => {
  const isZero = score === 0 && total === 0;
  const percentage = total > 0 ? Math.min(100, Math.max(0, (score / total) * 100)) : 0;

  return (
    <div className={`w-[80px] rounded-full bg-gray-200 ${className}`}>
      <div
        className={`rounded-full p-1 text-center leading-none ${
          isZero ? 'bg-gray-200' : 'bg-green-600'
        }`}
        style={{ width: isZero ? '100%' : `${percentage}%` }}
      />
    </div>
  );
};

export default CWProgressBar;
