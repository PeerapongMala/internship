import { FC } from 'react';
import { Select } from '@core/design-system/library/vristo/source/components/Input';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';

export interface SelectLimitProps {
  className?: string;
}

const CWMSelectLimit: FC<SelectLimitProps> = ({ className }) => {
  const options = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '30', value: 30 },
  ];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <p>แสดงท 1 จาก 12 หน้า</p>
      <Select
        defaultValue={options[0]}
        menuPlacement="top"
        className="w-20"
        options={options}
      />
    </div>
  );
};

export default CWMSelectLimit;
