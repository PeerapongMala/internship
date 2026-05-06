import { pagination } from '@core/helper/api-mock';
import { PaginationAPIResponse } from '@core/helper/api-type';
import { AnnounceData } from '@domain/g02/g02-d02/g02-d02-p01-annoucement/type';
import MockJson from './index.json';

const GlobalAnnouncementSchoolGet = (): Promise<PaginationAPIResponse<AnnounceData>> => {
  return Promise.resolve(
    pagination({
      data: MockJson as AnnounceData[],
      page: 1,
      limit: -1,
    }),
  );
};
export default GlobalAnnouncementSchoolGet;
