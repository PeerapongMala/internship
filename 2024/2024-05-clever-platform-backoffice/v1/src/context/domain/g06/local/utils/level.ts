import { TContentIndicatorSetting } from '../types/content';

export function isSelectedAtLeastOneLevel(settings: TContentIndicatorSetting[]): boolean {
  for (let i = 0; i < settings.length; i++) {
    if (isHasAtLeastOneLevel(settings[i].value)) {
      return true;
    }
  }

  return false;
}

/**
 * check is select at least 1 level in value.
 * this value store like [1,2,3] or [] when not have any level
 */
export function isHasAtLeastOneLevel(value: string): boolean {
  return /\d/.test(value);
}
