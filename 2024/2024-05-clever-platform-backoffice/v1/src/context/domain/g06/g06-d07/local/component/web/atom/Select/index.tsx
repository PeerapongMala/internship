import styles from './index.module.css';

export default function Select({
  value,
  className,
  children,
  defaultValue,
}: {
  value?: string;
  className?: string;
  children: React.ReactNode;
  defaultValue?: string;
}) {
  return (
    <div className="relative h-fit w-fit">
      <select
        defaultValue={value ? undefined : defaultValue} // ใช้ defaultValue เมื่อไม่มีค่า value
        value={value} // ใช้ value เมื่อเป็น controlled component
        className={`${styles['select']} ${className ? className : ''}`}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg
          className="h-4 w-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 10l5 5 5-5"
          />
        </svg>
      </div>
    </div>
  );
}
