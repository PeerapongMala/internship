import CWSelect, { TCWSelectProps } from '@component/web/cw-select';
import { useEffect, useState } from 'react';
import API from '@domain/g06/g06-d01/local/api';
import { Year } from '@domain/g06/g06-d01/local/api/type';
import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import useModal from '@global/utils/useModal';

type SelectYearProps = Omit<TCWSelectProps, 'options'> & { schoolID: string };

// million-ignore
const SelectYear = ({ schoolID, onChange, ...props }: SelectYearProps) => {
  const [pendingYear, setPendingYear] = useState<any | null>(null);
  const [yearList, setYearList] = useState<Year[]>([]);

  const modalConfirm = useModal();

  useEffect(() => {
    getYearList();
  }, []);

  const getYearList = async () => {
    const response = await API.Year.Gets(Number(schoolID), {
      page: 1,
      limit: -1,
    });
    if (response.status_code === 200) {
      setYearList(response.data);
    }
  };

  return (
    <div>
      <CWSelect
        {...props}
        options={yearList.map((item) => ({
          label: item.short_name ?? '',
          value: item.short_name,
        }))}
        label={'ชั้นปี'}
        onChange={(e) => {
          setPendingYear(e);
          modalConfirm.open();
        }}
      />

      <CWModalCustom
        title="ยืนยันเปลี่ยน ชั้นปี"
        open={modalConfirm.isOpen}
        buttonName="ตกลง"
        cancelButtonName="ยกเลิก"
        onClose={() => {
          setPendingYear(null);
          modalConfirm.close();
        }}
        onOk={() => {
          if (pendingYear !== null) {
            onChange?.(pendingYear);
          }

          setPendingYear(null);
          modalConfirm.close();
        }}
      >
        <div>
          คุณยืนยันที่จะเปลี่ยน ชั้นปี ใช่หรือไม่
          <br />
          หากยืนยัน ข้อมูลวิชาCleverทั้งหมดจะถูกคืนค่า
        </div>
      </CWModalCustom>
    </div>
  );
};

export default SelectYear;
