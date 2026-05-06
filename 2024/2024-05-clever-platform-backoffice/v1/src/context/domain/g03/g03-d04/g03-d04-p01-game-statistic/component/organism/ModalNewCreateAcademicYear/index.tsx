import { useCallback, useEffect, useMemo, useState } from 'react';
import { Input } from '@core/design-system/library/vristo/source/components/Input';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import CWMDaterange from '@component/web/molecule/cw-m-date-range';
import API from '@domain/g03/g03-d04/local/api';
import StoreGlobalPersist from '@store/global/persist';
import showMessage from '@global/utils/showMessage';

interface ModalNewCreateAcademicYearProps extends ModalProps {
  open: boolean;
  schoolId?: number;
  onClose: () => void;
}
const ModalNewCreateAcademicYear = ({
  open,
  onClose,
  schoolId,
}: ModalNewCreateAcademicYearProps) => {
  const { userData } = StoreGlobalPersist.StateGet(['userData']);
  const [year, setYear] = useState<string>('');
  const [date, setDate] = useState<{
    start_date: Date | null;
    end_date: Date | null;
  }>({
    start_date: null,
    end_date: null,
  });

  useEffect(() => {
    if (open) {
      setYear('');
      setDate({
        start_date: null,
        end_date: null,
      });
    }
  }, []);

  const isDisabled = useMemo(() => {
    return year.length !== 4 || date.start_date === null || date.end_date === null;
  }, [year, date]);

  const onSave = useCallback(() => {
    API.academicYear
      .CreateAcademicYearRanges({
        name: year,
        start_date: date.start_date?.toISOString() || '',
        end_date: date.end_date?.toISOString() || '',
        school_id: Number(userData?.school_id || schoolId),
      })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('สร้างปีการศึกษาสำเร็จ', 'success');
          setYear('');
          setDate({
            start_date: null,
            end_date: null,
          });
          onClose();
        }
      })
      .catch((_err) => {
        showMessage('สร้างปีการศึกษาไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
      });
  }, [onClose, year, date]);

  return (
    <Modal
      className="w-md"
      disableCancel
      disableOk
      title="สร้างปีการศึกษา"
      open={open}
      onClose={() => {
        setYear('');
        setDate({
          start_date: null,
          end_date: null,
        });
        onClose();
      }}
    >
      <div className="flex space-x-4">
        <Input
          className="w-2/5"
          placeholder="ปีการศึกษา"
          onInput={(e) => {
            // Force the value to be numeric only and limit to 4 digits
            const numericValue = e.target.value.replace(/[^0-9]/g, '');
            const limitedValue = numericValue.substring(0, 4);

            // Directly modify the input element's value to enforce the constraint
            e.target.value = limitedValue;

            // Update state with the cleaned value
            setYear(limitedValue);
          }}
          value={year}
        />
        <div className="relative w-3/5">
          <CWMDaterange
            onChange={(e) => {
              setDate({
                start_date: e[0],
                end_date: e[1],
              });
            }}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button
          className="btn btn-outline-primary w-44"
          onClick={() => {
            setYear('');
            setDate({
              start_date: null,
              end_date: null,
            });
            onClose();
          }}
        >
          ย้อนกลับ
        </button>
        <button
          className="btn btn-primary w-44"
          onClick={() => {
            onSave();
          }}
          disabled={isDisabled}
        >
          บันทึก
        </button>
      </div>
    </Modal>
  );
};

export default ModalNewCreateAcademicYear;
