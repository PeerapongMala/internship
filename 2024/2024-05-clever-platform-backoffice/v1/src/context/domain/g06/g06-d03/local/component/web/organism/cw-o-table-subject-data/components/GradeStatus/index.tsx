import CWSelect from '@component/web/cw-select';
import { EGradeStatus } from '@domain/g06/local/enums/grade';

type GradeStatusProps = {
  value?: EGradeStatus;
  disabled?: boolean;
  onChange: (value: EGradeStatus) => void;
};

const GradeStatus = ({ value, onChange, disabled }: GradeStatusProps) => {
  const options = Object.values(EGradeStatus).map((status) => ({
    value: status,
    label: status,
  }));

  return (
    <td>
      <CWSelect
        disabled={disabled}
        value={value}
        options={options}
        hideEmptyOption
        className="mb-2 h-8 px-2 py-1 text-sm"
        onChange={({ target }) => {
          const val = target.value as EGradeStatus;
          if (Object.values(EGradeStatus).includes(val)) {
            onChange(val);
          }
        }}
      />
    </td>
  );
};

export default GradeStatus;
