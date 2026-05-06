import { TAdditionalFieldNutrition } from '@domain/g06/local/types/template';
import { formatToDate } from '@global/utils/format/date';
import { IGetSheetDetail } from '../type';
import dayjs from '@global/utils/dayjs';

export function isNutritionDataValid(nutrition?: TAdditionalFieldNutrition[][]): boolean {
  if (!Array.isArray(nutrition) || nutrition.length !== 2) return false;

  return nutrition.every(
    (term) =>
      Array.isArray(term) &&
      term.length === 2 &&
      term.every((entry) => entry && typeof entry === 'object'),
  );
}

export function formatHistoryLabel(
  dateInput: dayjs.ConfigType,
  version: string,
  isLatestVersion: boolean,
) {
  const date = `${formatToDate(dateInput, { shortMonth: true, withTime: true })}`;

  let label = `${version} (${date})`;
  if (isLatestVersion) {
    label += ` - ล่าสุด`;
  }

  return label;
}
