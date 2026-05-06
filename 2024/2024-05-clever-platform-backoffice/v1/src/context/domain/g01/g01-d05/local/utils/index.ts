export function getDateTime() {
  return `${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('')}T${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/:/g, '')}`;
}

export function toOptions<T>(data: T[], label: keyof T, value: keyof T) {
  return data.map((item) => ({
    label: item[label]?.toString() ?? '',
    value: item[value]?.toString() ?? '',
  }));
}
