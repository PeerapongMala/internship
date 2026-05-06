import CWInput from '@component/web/cw-input';

type RemarkProps = {
  value?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

// million-ignore
const Remark = ({ value, onChange, disabled }: RemarkProps) => {
  return (
    <td className="border p-0">
      <CWInput
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        inputClassName="!w-full"
      />
    </td>
  );
};

export default Remark;
