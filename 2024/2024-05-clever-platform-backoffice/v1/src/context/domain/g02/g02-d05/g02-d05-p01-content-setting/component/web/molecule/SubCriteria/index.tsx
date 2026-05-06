import CWButton from '@component/web/cw-button';
import ModalSelect, {
  OptionProps,
} from '@core/design-system/library/component/web/Modal/ModalSelect';
import { Input } from '@core/design-system/library/vristo/source/components/Input';
import { SubCriteriaTopic } from '@domain/g02/g02-d05/local/type';
import { useEffect, useState } from 'react';

const SubCriteria = ({
  label,
  value,
  onChange,
  keyName,
  optionsSubCriteriaTopic,
}: {
  label?: string;
  keyName: string;
  value?: number;
  onChange: (key: string, value: string) => void;
  optionsSubCriteriaTopic?: SubCriteriaTopic[];
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<OptionProps[]>([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = (selectedValue: string) => {
    setOpen(false);
    onChange(keyName, selectedValue);
  };

  const getTitle = (value?: number) => {
    const selectedOption = options.find((option) => option.value === value?.toString());
    return selectedOption ? selectedOption.title : '';
  };

  useEffect(() => {
    if (optionsSubCriteriaTopic) {
      const newOptions = optionsSubCriteriaTopic.map((item) => ({
        title: item.short_name,
        label: item.name,
        value: item.id.toString(),
      }));
      setOptions(newOptions);
    }
  }, [optionsSubCriteriaTopic]);

  return (
    <div className="flex gap-1">
      <ModalSelect
        onOk={handleOk}
        onClose={handleClose}
        open={open}
        options={options}
        value={value?.toString()}
        title={'เลือก' + label}
      />
      <Input
        className="w-full"
        label={label || ' '}
        value={getTitle(value)}
        disabled
        // onInput={(e) => onChange(keyName, e.target.value)}
      />
      <CWButton
        type="button"
        className="h-[38px] w-36 self-end"
        title="เปลี่ยน"
        outline
        onClick={handleOpen}
      />
    </div>
  );
};

export default SubCriteria;
