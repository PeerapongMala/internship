import WCAInputDropdown from '@component/web/atom/wc-a-input-dropdown.tsx';

type SelectSchoolProps = {
  inputValue: string;
  dropdownValue: string;
  onInputValueChange?: (v: string) => void;
  onDropdownValueChange?: (v: string) => void;
};

const SelectSchool = ({
  inputValue,
  dropdownValue,
  onDropdownValueChange,
  onInputValueChange,
}: SelectSchoolProps) => {
  return (
    <div className="w-full">
      <WCAInputDropdown
        dropdownClassName={{ inner: 'w-full', option: '', outer: '' }}
        inputPlaceholder="เลือกโรงเรียน"
        inputValue={inputValue}
        onInputChange={(e) => {
          const value = e.target.value;

          if (dropdownValue == 'school_id' && isNaN(Number(value))) {
            onInputValueChange?.('');
            return;
          }

          onInputValueChange?.(value);
        }}
        onDropdownSelect={(v) => onDropdownValueChange?.(String(v))}
        dropdownValue={dropdownValue}
        dropdownOptions={[
          { label: 'ทั้งหมด', value: '' },
          { label: 'ID', value: 'school_id' },
          { label: 'รหัสย่อโรงเรียน', value: 'school_code' },
          { label: 'ชื่อโรงเรียน', value: 'school_name' },
        ]}
      />
    </div>
  );
};

export default SelectSchool;
