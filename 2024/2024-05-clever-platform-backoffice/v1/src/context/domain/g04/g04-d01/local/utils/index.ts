export function getDate(date: string, offset = 7) {
  const _date = getDateTimeOffset(date, offset);
  // const _date = new Date(date)?.toISOString();
  return _date?.split('T')[0] ?? '';
}

export function getTime(date: string, offset = 7) {
  const _date = getDateTimeOffset(date, offset);
  // const _date = new Date(date)?.toISOString();
  return _date?.split('T')[1]?.slice(0, 5) ?? '';
}

export function getDateTimeOffset(date: string, offset: number) {
  const _date = new Date(date);
  if (_date instanceof Date && !isNaN(_date.getTime())) {
    return new Date(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours() + offset,
      _date.getMinutes(),
    ).toISOString();
  } else {
    return date;
  }
}
