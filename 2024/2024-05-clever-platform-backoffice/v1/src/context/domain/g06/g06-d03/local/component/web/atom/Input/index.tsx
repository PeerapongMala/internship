export default function Input({
  value,
  className,
  type = 'text',
}: {
  value?: string | number;
  className?: string;
  type?: string;
}) {
  return (
    <input type={type} className={`rounded border p-1 ${className}`} value={value} />
  );
}
