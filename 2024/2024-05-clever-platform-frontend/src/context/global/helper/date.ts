export function toDateTH(date: Date | string | number) {
  if (date == undefined) return '';
  if (typeof date == 'number' || typeof date == 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'narrow',
    year: 'numeric',
  });
}

export function toDateTimeTH(date: Date | string | number) {
  if (date == undefined) return '';
  if (typeof date == 'number' || typeof date == 'string') {
    date = new Date(date);
  }
  return `${toDateTH(date)} ${date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export function fromISODateToYYYYMMDD(timestamp: string) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function fromISODateToMMDDYYYY(timestamp: string) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}/${year}`;
}

export function fromDateToYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getStartOfWeek() {
  const today = new Date();
  const day = today.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function getEndOfWeek() {
  const startOfWeek = getStartOfWeek();
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
}

export function getCurrentWeekDates() {
  const startOfWeek = getStartOfWeek();
  const endOfWeek = getEndOfWeek();
  const dates = [];
  for (
    let date = new Date(startOfWeek);
    date <= endOfWeek;
    date.setDate(date.getDate() + 1)
  ) {
    dates.push(new Date(date));
  }
  return dates;
}

export function toDDMMYYCurrentTime(date: Date | string | number) {
  if (date == undefined) return '';
  if (typeof date == 'number' || typeof date == 'string') {
    date = new Date(date);
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
