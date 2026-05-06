import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconCalendar from '@core/design-system/library/component/icon/IconCalendar';
import styles from './index.module.css';

interface CMWDaterangeProps {
  value?: undefined | Date | string;
  onChange?: (value: Array<Date>) => void | undefined;
  defaultValue?: string;
}

export default function CWMDaterange({
  value,
  onChange = () => {},
  defaultValue,
}: CMWDaterangeProps) {
  return (
    <div className={styles['date-range-container']}>
      <Flatpickr
        options={{
          mode: 'range',
          dateFormat: 'Y-m-d',
          position: 'auto right',
          locale: {
            rangeSeparator: ' - ',
          },
        }}
        value={value}
        onChange={onChange}
        className="form-input"
        placeholder={defaultValue || 'วว/ดด/ปปปป - วว/ดด/ปปปป'}
        style={{ paddingRight: '2.5rem' }} // เพิ่ม padding เพื่อหลีกเลี่ยงการซ้อนทับกับไอคอน
      />

      {/* ไอคอน */}
      <div className={styles['icon']}>
        <IconCalendar />
      </div>
    </div>
  );
}
