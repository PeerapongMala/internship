import { getUserData } from '@global/utils/store/getUserData';
import { setUserSubjectDataByIndex } from '@global/utils/store/user-subject';
import WCADropdown from '../atom/wc-a-dropdown/WCADropdown';
import { useState } from 'react';

interface SelectUserSubjectDataProps {
  label?: string;
  required?: boolean;
  className?: string;
}
const SelectUserSubjectData = ({
  label,
  required,
  className,
}: SelectUserSubjectDataProps) => {
  const userData = getUserData();

  const subjectOptions = userData.subject.map((subject, index) => ({
    label: subject.name,
    value: index,
  }));

  const subjectLabels = subjectOptions.map((opt) => opt.label);

  const [selectedSubjectLabel, setSelectedSubjectLabel] = useState<string>(
    subjectOptions[0]?.label,
  );

  const handleSelect = (selectedLabel: string) => {
    setSelectedSubjectLabel(selectedLabel);
    const selected = subjectOptions.find((opt) => opt.label === selectedLabel);
    if (selected) {
      setUserSubjectDataByIndex(selected.value, userData);
    }
  };

  return (
    <div className={className}>
      <WCADropdown
        placeholder={selectedSubjectLabel}
        options={subjectLabels}
        onSelect={handleSelect}
        label={label}
        required={required}
        disabled={subjectOptions.length === 1}
      />
    </div>
  );
};

export default SelectUserSubjectData;
