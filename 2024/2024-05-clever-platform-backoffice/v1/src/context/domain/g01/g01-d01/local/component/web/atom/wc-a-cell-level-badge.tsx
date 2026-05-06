export default function LevelBadge({ value }: { value: 'easy' | 'medium' | 'hard' }) {
  return (
    <div
      className={`w-fit rounded-lg border px-[5px] py-[2px] text-center font-semibold ${
        (value === 'easy' && 'border-green-500 text-green-500') ||
        (value === 'medium' && 'border-yellow-500 text-yellow-500') ||
        (value === 'hard' && 'border-red-500 text-red-500') ||
        'text-neutral-900 dark:text-neutral-500'
      }`}
    >
      {(value === 'easy' && 'ง่าย') ||
        (value === 'medium' && 'ปานกลาง') ||
        (value === 'hard' && 'ยาก') ||
        value}
    </div>
  );
}
