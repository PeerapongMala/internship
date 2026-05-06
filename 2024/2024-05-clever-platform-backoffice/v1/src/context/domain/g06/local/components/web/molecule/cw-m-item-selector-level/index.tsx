import CWInputCheckbox from '@component/web/cw-input-checkbox';
import { useMemo } from 'react';

type SelectorLevelProps = {
  options: number[];
  value: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

/**
 * @value props send like [number,,number,number] example: [1,2,3]
 */
const SelectorLevel = ({ value, options, onChange, disabled }: SelectorLevelProps) => {
  const selectedLevels: number[] = useMemo(() => {
    let str = value.replace('[', '').replace(']', '');

    if (str.trim() === '') {
      return [];
    }

    return str.split(',').map((lv) => Number(lv));
  }, [value]);

  const handleSelectLevel = (id: number, checked: boolean) => {
    let updatedLevels: number[] = selectedLevels;

    if (checked) {
      updatedLevels.push(id);
      updatedLevels = updatedLevels.sort();
    } else {
      updatedLevels = updatedLevels.filter((lv) => lv != id);
    }

    onChange?.(JSON.stringify(updatedLevels));
  };

  return (
    <div className="flex w-full flex-wrap">
      {options?.map((id) => (
        <div key={`level-checkbox-${id}`} className="flex w-1/5">
          <CWInputCheckbox
            disabled={disabled}
            checked={selectedLevels.includes(id)}
            onChange={(e) => handleSelectLevel(id, e.target.checked)}
          />
          {id}
        </div>
      ))}
    </div>
  );
};

export default SelectorLevel;
