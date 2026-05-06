import { IUserData } from '@domain/g00/g00-d00/local/type';
import StoreGlobalPersist from '@store/global/persist';

export function getUserData(): IUserData {
  const {
    userData,
    targetData,
    isLoginAs,
  }: { userData: IUserData; targetData: IUserData; isLoginAs: boolean } =
    StoreGlobalPersist.StateGet(['userData', 'targetData', 'isLoginAs']);

  if (isLoginAs) {
    return targetData;
  }

  return userData;
}
