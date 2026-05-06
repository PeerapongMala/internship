import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { RepositoryPatternInterface } from '../../../../repository-pattern';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

// g03-d06-a01
export const ActivityGet: RepositoryPatternInterface['Global']['Acivities']['Get'] = (
  subjectId: string,
) => {
  const url = `${backendURL}/mail-box/v1/announcement/${subjectId}/event?limit=-1`;
  return fetchWithAuth(url, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
};

// g03-d06-a04
export const ActivityRead: RepositoryPatternInterface['Global']['Acivities']['Read'] = (
  announcementId: string,
) => {
  const url = `${backendURL}/mail-box/v1/announcement/${announcementId}`;
  return fetchWithAuth(url, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
};

// g03-d06-a09
export const ActivityReadAll: RepositoryPatternInterface['Global']['Acivities']['ReadAll'] =
  (subjectId: string) => {
    const url = `${backendURL}/mail-box/v1/announcement/${subjectId}/event`;
    return fetchWithAuth(url, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  };

const Activities: RepositoryPatternInterface['Global']['Acivities'] = {
  Get: ActivityGet,
  Read: ActivityRead,
  ReadAll: ActivityReadAll,
};

export default Activities;
