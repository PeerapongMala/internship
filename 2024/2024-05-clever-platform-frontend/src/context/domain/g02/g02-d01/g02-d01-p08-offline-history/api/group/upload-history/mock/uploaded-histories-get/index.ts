import { UploadHistoryData } from '@domain/g02/g02-d01/g02-d01-p08-offline-history/types';
import { APITypeAPIResponse } from '../../../../../../../../../../core/helper/api-type';
import MockJson from './index.json';

const UploadedHistoriesGet = (): APITypeAPIResponse<UploadHistoryData[]> => {
  return new Promise((resolve, reject) => {
    resolve({ json: () => MockJson as UploadHistoryData[] });
  });
};

export default UploadedHistoriesGet;
