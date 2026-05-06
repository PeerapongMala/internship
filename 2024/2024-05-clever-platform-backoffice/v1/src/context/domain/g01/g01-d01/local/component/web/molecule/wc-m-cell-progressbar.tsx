import CwProgress from '@component/web/cw-progress';

export default function CellProgressbar({
  value = 0,
  total = 100,
}: {
  value: number;
  total?: number;
}) {
  const filterNumber = (v: number) => v || 0;
  return (
    <div className="inline-block w-2/3">
      <span className="text-sm">
        {filterNumber(value)}/{filterNumber(total)}
      </span>
      <CwProgress percent={(filterNumber(value) / filterNumber(total)) * 100} />
    </div>
  );
}
