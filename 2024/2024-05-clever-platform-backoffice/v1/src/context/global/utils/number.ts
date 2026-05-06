import _ from 'lodash';

export function roundNumber(num: number, demical = 2) {
  const rounded = _.round(num, demical);
  return rounded == parseInt(num.toString()) ? num : rounded.toFixed(2);
}

export function roundNumberForString(value: unknown): number {
  if (typeof value === 'number') return _.round(value, 2);
  if (typeof value === 'string') {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : _.round(num, 2);
  }
  return 0;
}
