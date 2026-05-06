import Label from '../../../../../local/component/web/atom/Label';
import Input from '../../../../../local/component/web/atom/Input';

export default function FormRow({
  label,
  value,
  classNameInput,
  classNameLabel,
  className,
  labelAfter,
}: {
  label?: string;
  value: string | number;
  classNameInput?: string;
  classNameLabel?: string;
  className?: string;
  labelAfter?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 ${className ? className : ''}`}
    >
      {label && (
        <Label className={` ${classNameLabel ? classNameLabel : ''}`} text={label} />
      )}
      <Input className={classNameInput} value={value} />
      {labelAfter && (
        <Label className={` ${classNameLabel ? classNameLabel : ''}`} text={labelAfter} />
      )}
    </div>
  );
}
