import CWSelect from '@component/web/cw-select';
import CwProgress from '@component/web/cw-progress';

interface Option {
  value: any;
  label: string;
}

interface InputSelectProps {
  title: string;
  selectitle?: string;
  className?: string;
  placeholder?: string;
  selectValue?: string | number;
  progressValue?: number;
  options?: Option[];
  onChange?: (e: any) => void;
  selectable?: boolean;
}

const ProgressSelectTemplate = ({
  title,
  selectitle,
  className,
  placeholder,
  selectValue,
  progressValue,
  options,
  onChange,
  selectable = true,
}: InputSelectProps) => {
  const handleChange = (e: any) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`${className}`}>
      {selectable ? (
        <CWSelect
          value={selectValue}
          label={title}
          className="pt-4"
          options={options}
          onChange={handleChange}
        />
      ) : (
        <h2 className="text-md pt-3">{title}</h2>
      )}
      <div className="flex items-center gap-2 pb-5 pt-4">
        <h2 className="text-[16px]">ความก้าวหน้าเฉลี่ย:</h2>
        <h1 className="text-[28px]">{progressValue}%</h1>
      </div>

      {/* <div className="relative pt-4">
        <h1 className="pb-5 pt-2 text-[28px]">{progressValue}%</h1>
        <div className="w-[100px]">
          <CwProgress percent={progressValue || 0} />
        </div>
      </div> */}
    </div>
  );
};

export default ProgressSelectTemplate;
