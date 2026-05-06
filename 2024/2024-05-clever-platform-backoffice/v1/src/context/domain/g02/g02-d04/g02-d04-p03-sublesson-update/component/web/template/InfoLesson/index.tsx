import React, { useEffect, useState } from 'react';
import { optionIndicators } from '../../../option';
import {
  Select,
  Input,
} from '@core/design-system/library/vristo/source/components/Input';
import CWInput from '@component/web/cw-input';
import CWSelectValue from '@component/web/cw-selectValue';
import { SubLessonData } from '@domain/g02/g02-d04/local/api/type';

interface InfolessonSet {
  data?: SubLessonData[];
  nameSet?: (e: string) => void;
  indicatorSelect?: () => void;
  indicatorSet: (e: number) => void;
}

const Infolesson = ({ data, nameSet, indicatorSet }: InfolessonSet) => {
  const [selectedIndicator, setSelectedIndicator] = useState<number | undefined>(
    undefined,
  );

  console.log({ data: data });
  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedIndicator(data[0].indicator_id);
    }
  }, [data]);

  return (
    <div>
      <div className="grid w-full grid-cols-2 gap-5 xl:grid-cols-4">
        <CWInput
          className="col-span-2 w-full"
          label="เพิ่มบทเรียนย่อย"
          placeholder="โปรดกรอก"
          value={data?.[0]?.name || ''}
          required
          onChange={(e) => {
            if (nameSet) {
              nameSet(e.target.value || '');
            }
          }}
        />

        <CWSelectValue
          className="col-span-4 w-full"
          label="ตัวชี้วัด"
          options={
            data?.map((item) => ({
              label: item.indicator_name,
              value: item.indicator_id,
            })) || []
          }
          value={selectedIndicator}
          onChange={(e) => {
            const value = Number(e.value) || 0;
            setSelectedIndicator(value);
            indicatorSet(value);
          }}
          disabled
        />
      </div>
    </div>
  );
};

export default Infolesson;
