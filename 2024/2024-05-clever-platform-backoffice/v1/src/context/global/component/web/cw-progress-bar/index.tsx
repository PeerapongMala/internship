interface ProgressBarProps {
  score: number;
  total: number;
  className?: string;
}

const CWProgressBar = ({ score, total, className }: ProgressBarProps) => {
  const percentage = total > 0 ? Math.min(100, Math.max(0, (score / total) * 100)) : 0;
  const roundedPercentage = Math.round(percentage);

  return (
    <div
      className={`h-2 w-full max-w-[100px] overflow-hidden rounded-full bg-gray-200 ${className}`}
    >
      <div
        className="h-full rounded-full bg-success transition-all duration-300 ease-out"
        style={{ width: `${roundedPercentage}%` }}
      />
    </div>
  );
};

export default CWProgressBar;
