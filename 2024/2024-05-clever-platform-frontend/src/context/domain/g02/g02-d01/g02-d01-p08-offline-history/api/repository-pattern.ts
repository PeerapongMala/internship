import { APITypeAPIResponse } from '../../../../../../core/helper/api-type';
import { UploadHistoryData } from '../types';

export interface RepositoryPatternInterface {
  UploadHistory: {
    OfflineHistories: { Get(): APITypeAPIResponse<UploadHistoryData[]> };
    UploadedHistories: { Get(): APITypeAPIResponse<UploadHistoryData[]> };
  };
}
