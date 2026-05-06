import { TUserSubject } from '@global/types/user';
import { getUserData } from './getUserData';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@store/global/persist';
import { IUserData } from '@domain/g00/g00-d00/local/type';

export function getUserSubjectData(): TUserSubject {
  const userData = getUserData();

  return userData.subject[0];
}

export function setUserSubjectDataByIndex(selectedIndex: number, userData: IUserData) {
  const store = StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface'];

  const subjects = userData.subject;

  if (!selectedIndex || selectedIndex > subjects.length - 1) return;

  const subject = subjects[selectedIndex];
  subjects.splice(selectedIndex, 1);
  subjects.unshift(subject);

  store.setUserData({ ...userData, subject: subjects });
}
