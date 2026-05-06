import CWSelect, { SelectOption } from '@component/web/cw-select';
import API from '@domain/g03/g03-d01/local/api';
import { TPaginationReq } from '@domain/g06/g06-d02/local/types';
import { useEffect, useMemo, useState } from 'react';
import dayjs from '@global/utils/dayjs';

type AcademicYearDropdownProps = {
  filter: TPaginationReq & {};
  onSelect?: (data: {
    academic_year: number;
    start_date: string;
    end_date: string;
  }) => void;
};

const CWAcademicYearDropdown = ({ filter, onSelect }: AcademicYearDropdownProps) => {
  const [academicYear, setAcademicYear] = useState<
    {
      academic_year: number;
      start_date: string;
      end_date: string;
    }[]
  >([]);

  const [options, setOptions] = useState<SelectOption[]>([]);

  const currentYear = useMemo(() => Number(dayjs().format('BBBB')), []);

  useEffect(() => {
    API.dashboard.GetA01(filter).then((res) => {
      if (res.status_code == 200) {
        setAcademicYear(res.data);
        setOptions(
          res.data.map((data, index) => ({
            label:
              data.academic_year === currentYear
                ? `ข้อมูลปีปัจจุบัน (${currentYear})`
                : String(data.academic_year),
            value: index,
          })),
        );
      }

      if (res.status_code != 200) {
        console.error(res);
      }
    });
  }, [options]);

  return (
    <CWSelect
      options={options}
      onChange={(e) => {
        const index: number = e.target.value;
        onSelect?.(academicYear[index]);
      }}
    />
  );
};

export default CWAcademicYearDropdown;
