import React, { useState } from 'react';
import { optionIndicators } from '../../../option';
import {
  Select,
  Input,
} from '@core/design-system/library/vristo/source/components/Input';
import { Indicator } from '@domain/g02/g02-d04/local/api/type';
import CWSelectValue from '@component/web/cw-selectValue';
import CWInput from '@component/web/cw-input';

interface InfolessonSet {
  nameSet: (e: string) => void;
  indicatorSet: (e: number) => void;
  indicatorData: Indicator[];
}

const Infolesson = ({ nameSet, indicatorSet, indicatorData }: InfolessonSet) => {
  const [selectedIndicator, setSelectedIndicator] = useState<number | ''>('');
  return (
    <div>
      <div className="grid w-full grid-cols-2 gap-5 xl:grid-cols-4">
        <CWInput
          className="col-span-2 w-full"
          label="เพิ่มบทเรียนย่อย"
          placeholder="โปรดกรอก"
          required
          onChange={(e) => {
            nameSet(e.target.value || '');
          }}
        />
        <CWSelectValue
          className="col-span-4 w-full"
          label="ตัวชี้วัด"
          value={selectedIndicator}
          options={indicatorData.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          onChange={(selectedValue) => {
            setSelectedIndicator(selectedValue);
            indicatorSet(selectedValue);
          }}
          required
        />
      </div>
    </div>
  );
};

export default Infolesson;
