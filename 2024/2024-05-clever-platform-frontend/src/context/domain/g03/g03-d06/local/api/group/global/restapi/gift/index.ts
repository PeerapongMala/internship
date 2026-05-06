import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { RepositoryPatternInterface } from '../../../../repository-pattern';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

// g03-d06-a12
export const GiftGet: RepositoryPatternInterface['Global']['Gifts']['Get'] = (
  subjectId: string,
) => {
  const url = `${backendURL}/mail-box/v1/announcement/${subjectId}/teacher-reward?limit=-1`;
  return fetchWithAuth(url, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
};

// g03-d06-a15
export const GiftReadAll: RepositoryPatternInterface['Global']['Gifts']['ReadAll'] = (
  subjectId: string,
) => {
  const url = `${backendURL}/mail-box/v1/announcement/${subjectId}/teacher-reward`;
  return fetchWithAuth(url, {
    method: 'PATCH',
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
};

// g03-d06-a14
export const GiftDelete: RepositoryPatternInterface['Global']['Gifts']['Delete'] = (
  subjectId: string,
  rewardId: string,
) => {
  const url = `${backendURL}/mail-box/v1/announcement/${subjectId}/teacher-reward/${rewardId}`;
  return fetchWithAuth(url, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
};

// g03-d06-a16
export const GiftDeleteAllRead: RepositoryPatternInterface['Global']['Gifts']['DeleteAllRead'] =
  (subjectId: string) => {
    const url = `${backendURL}/mail-box/v1/announcement/${subjectId}/teacher-reward`;
    return fetchWithAuth(url, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  };

// g03-d06-a13
export const GiftReceiveItem: RepositoryPatternInterface['Global']['Gifts']['ReceiveItem'] =
  (subjectId: string, rewardId: string) => {
    const url = `${backendURL}/mail-box/v1/announcement/${subjectId}/teacher-reward/${rewardId}`;
    return fetchWithAuth(url, {
      method: 'PATCH',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  };

const Gifts: RepositoryPatternInterface['Global']['Gifts'] = {
  Get: GiftGet,
  ReadAll: GiftReadAll,
  Delete: GiftDelete,
  DeleteAllRead: GiftDeleteAllRead,
  ReceiveItem: GiftReceiveItem,
};

export default Gifts;
