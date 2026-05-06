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
