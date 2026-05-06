import dayjs from '@global/utils/dayjs';
import { Dayjs } from 'dayjs';

export function getMonthDayCounts(startDate: Dayjs, endDate: Dayjs) {
  const start = dayjs(startDate).startOf('day');
  const end = dayjs(endDate).startOf('day');

  if (end.isBefore(start)) {
    throw new Error('endDate must be on or after startDate');
  }

  const result: { dateIso: string; days: number }[] = [];

  let cursor = start.startOf('month');

  while (cursor.isSameOrBefore(end, 'month')) {
    const monthStart = cursor.startOf('month');
    const monthEnd = cursor.endOf('month');

    const rangeStart = dayjs.max(start, monthStart);
    const rangeEnd = dayjs.min(end, monthEnd);

    const days = rangeEnd.diff(rangeStart, 'day') + 1;

    result.push({
      dateIso: monthStart.format(),
      days,
    });

    cursor = cursor.add(1, 'month');
  }

  return result;
}

export function getDatesInRange(startDate: Dayjs, endDate: Dayjs): Dayjs[] {
  const dates: Dayjs[] = [];
  let currentDate = dayjs(startDate).startOf('day'); // Start exactly at the beginning of the start date
  const end = dayjs(endDate).startOf('day'); // End exactly at the beginning of the end date

  if (end.isBefore(currentDate)) {
    throw new Error('endDate must be on or after startDate');
  }

  while (currentDate.isSame(end, 'day') || currentDate.isBefore(end, 'day')) {
    dates.push(dayjs(currentDate)); // Push a clone to avoid mutation issues
    currentDate = currentDate.add(1, 'day');
  }

  return dates;
}
