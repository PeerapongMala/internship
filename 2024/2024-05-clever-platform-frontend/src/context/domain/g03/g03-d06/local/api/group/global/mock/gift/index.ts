import { pagination, responseOk } from '@core/helper/api-mock';
import { RepositoryPatternInterface } from '../../../../repository-pattern';
import MockJson from './index.json';

export const GiftGet: RepositoryPatternInterface['Global']['Gifts']['Get'] = (
  subjectId: string,
) => {
  return Promise.resolve(
    pagination({
      data: MockJson,
      page: 1,
      limit: -1,
    }),
  );
};

export const GiftReadAll: RepositoryPatternInterface['Global']['Gifts']['ReadAll'] = (
  subjectId: string,
) => {
  return Promise.resolve(responseOk({ data: undefined, message: 'Announcements Read' }));
};

export const GiftDelete: RepositoryPatternInterface['Global']['Gifts']['Delete'] = (
  rewardId: string,
) => {
  return Promise.resolve(responseOk({ data: undefined, message: 'Deleted' }));
};

export const GiftDeleteAllRead: RepositoryPatternInterface['Global']['Gifts']['DeleteAllRead'] =
  (subjectId: string) => {
    return Promise.resolve(responseOk({ data: undefined, message: 'Deleted' }));
  };

export const GiftReceiveItem: RepositoryPatternInterface['Global']['Gifts']['ReceiveItem'] =
  (subjectId: string, rewardId: string) => {
    return Promise.resolve(responseOk({ data: undefined, message: 'Receive Item' }));
  };

const Gifts: RepositoryPatternInterface['Global']['Gifts'] = {
  Get: GiftGet,
  ReadAll: GiftReadAll,
  Delete: GiftDelete,
  DeleteAllRead: GiftDeleteAllRead,
  ReceiveItem: GiftReceiveItem,
};

export default Gifts;
