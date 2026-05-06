export class NumeralFormat {
  static formatDecimal(num: number | string) {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(num));
  }
}
