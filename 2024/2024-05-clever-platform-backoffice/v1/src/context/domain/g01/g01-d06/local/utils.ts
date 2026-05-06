export function formatThaiDate(date: Date) {
  return date.toLocaleTimeString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function thaiDateNow() {
  return formatThaiDate(new Date());
}
