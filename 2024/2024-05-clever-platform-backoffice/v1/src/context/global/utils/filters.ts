export function searchInRow(searchText: string, row: Record<string, any>) {
  return Object.keys(row).some((key) => row[key]?.toString().includes(searchText));
}

export function isKeyOfObject<T extends Object>(
  key: string | number | symbol,
  obj: T,
): key is keyof T {
  return key in obj;
}
