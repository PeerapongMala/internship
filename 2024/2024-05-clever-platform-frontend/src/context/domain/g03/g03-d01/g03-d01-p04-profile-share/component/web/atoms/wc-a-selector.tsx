interface SelectorProps {
  value?: string;
  onValueChange?: (x: string) => void;
  options?: { label: string; value: string }[];
  className?: string;
}

export function Selector({
  value,
  onValueChange,
  options,
  className = '',
}: SelectorProps) {
  return (
    <select
      className={`flex min-w-[100px] w-full border border-solid border-[#fcd401] py-4 px-2 rounded-full text-center gap-4 self-stretch ${className}`}
      value={value}
      onChange={(evt) => {
        const selectedValue = evt.currentTarget.value;
        if (onValueChange) onValueChange(selectedValue);
      }}
    >
      {options?.map((option) => {
        const { label, value: optionValue } = option;
        return <option value={optionValue}>{label}</option>;
      })}
    </select>
  );
}

export default Selector;
