import CWInput from '@component/web/cw-input';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import { TContentIndicatorSetting } from '@domain/g06/local/types/content';
import { isHasAtLeastOneLevel } from '@domain/g06/local/utils/level';
import { ReactNode, useMemo, useState } from 'react';

type ItemSelectLevelSettingProps = {
  disabledEdit?: boolean;
  options: number[];
  indicatorID?: number;
  setting: TContentIndicatorSetting;
  required?: boolean;
  onChange?: (setting: TContentIndicatorSetting) => void;
  onSelect?: () => void;
  score?: ReactNode;
};

const ItemSelectLevelSetting = ({
  options,
  setting,
  onChange,
  disabledEdit,
  required,
  score,
}: ItemSelectLevelSettingProps) => {
  const checked = useMemo(() => {
    return options?.length ? setting.value === `[${options?.toString?.()}]` : false;
  }, [setting.value, options]);

  const [selected, setSelected] = useState(checked || setting.level_count > 0);

  const weightRequired = useMemo(() => {
    return isHasAtLeastOneLevel(setting.value);
  }, [setting.value]);

  const handleCheck = (checked: boolean) => {
    if (!checked) {
      onChange?.({ ...setting, value: '[]' });
      return;
    }

    onChange?.({ ...setting, value: `[${options?.toString?.()}]` });
  };

  const handleCheckV2 = (checked: boolean) => {
    if (!checked) {
      onChange?.({ ...setting, level_count: 0, weight: 0 });
    }
    setSelected(checked);
  };

  return (
    <div className="grid w-full grid-cols-3 items-center">
      <span className="flex items-center">
        <CWInputCheckbox
          disabled={disabledEdit || options?.length == 0 || !options}
          checked={selected}
          onChange={(e) => handleCheckV2(e.target.checked)}
          className=""
          type="checkbox"
        />
        {setting.evaluation_topic}
      </span>

      <div className="flex items-center text-nowrap pl-5 text-base font-normal">
        <CWInput
          disabled={disabledEdit || options?.length == 0 || !options || !selected}
          value={setting.level_count}
          type="number"
          min={0}
          max={options?.length ?? 0}
          onChange={(e) =>
            onChange?.({
              ...setting,
              level_count:
                Number(e.target.value) > options?.length
                  ? options.length
                  : Number(e.target.value),
            })
          }
          className="flex items-center gap-4 text-sm font-normal"
          inputClassName="!w-20 text-right hide-arrow"
          // required when edited available
          required={!disabledEdit && (selected || required)}
          placeholder="0"
        />

        <span className="w-full max-w-20 text-right"> / {options?.length ?? 0} ด่าน</span>
      </div>

      <div className="flex items-center gap-10">
        <CWInput
          disabled={disabledEdit || options?.length == 0 || !options || !selected}
          value={setting.weight}
          type="number"
          min={0}
          onChange={(e) => onChange?.({ ...setting, weight: Number(e.target.value) })}
          className="flex items-center gap-4 text-nowrap text-sm font-normal hide-arrow"
          // required when edited available
          // required={!disabledEdit && (weightRequired || required)}
          required={!disabledEdit && (selected || required)}
          label="น้ำหนัก"
        />

        <div>{score}</div>
      </div>
    </div>
  );
};

export default ItemSelectLevelSetting;
