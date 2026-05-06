import dayjs from 'dayjs';
import 'dayjs/locale/th'; // Import Thai locale
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(buddhistEra);

export class DateFormat {
  /**
   * Returns date in format: 31 มีนาคม 2568
   */
  static fullDate(date: string | Date): string {
    return dayjs(date).locale('th').format('D MMMM YYYY');
  }

  /**
   * Returns only day: 31
   */
  static day(date: string | Date): string {
    return dayjs(date).locale('th').format('D');
  }

  /**
   * Returns only month in Thai: มีนาคม
   */
  static month(date: string | Date): string {
    return dayjs(date).locale('th').format('MMMM');
  }

  /**
   * Returns only year in Buddhist calendar: 2568
   */
  static year(date: string | Date): string {
    // Add 543 years to convert to Buddhist era
    return dayjs(date).format('BBBB');
  }

  /**
   * Returns complete Thai formatted date with Buddhist year
   */
  static thaiDate(date: string | Date): string {
    const d = dayjs(date).locale('th');
    return `${d.format('D MMMM BBBB')}`;
  }
}
