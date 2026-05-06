import { TQrCodeData } from '../types/qrcode';

export const convertQrDataToObject = <T = never>(data: string) => {
  const result: TQrCodeData<T> = JSON.parse(data, (key: keyof TQrCodeData, value) => {
    if (key === 'expiredAt') {
      return new Date(value);
    }
    return value;
  });

  return result;
};

export const isValidISODate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString() === dateString;
};
