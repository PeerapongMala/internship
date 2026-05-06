interface CwProgressProps {
  percent: number;
}

export default function CwProgress({ percent = 0 }: CwProgressProps) {
  const safePercent = isNaN(percent) || percent < 0 ? 0 : percent;
  const limit = Math.min(safePercent, 100);

  return (
    <div className="relative my-1 ml-auto w-full">
      <div className="h-2 w-full rounded-full bg-[#ebedf2]">
        <div
          style={{ width: `${limit}%` }}
          className="h-2 rounded-full bg-success transition-all duration-300 ease-in-out"
        ></div>
      </div>
    </div>
  );
}
