import { PaginationAPIResponse } from '@core/helper/api-type';
import { AnnounceData } from '@domain/g02/g02-d02/g02-d02-p01-annoucement/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const GlobalAnnouncementSystemGet = (): Promise<PaginationAPIResponse<AnnounceData>> => {
  const url = `${backendURL}/global-announcement/v1/announcement/system?limit=-1`;
  return fetchWithAuth(url, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<AnnounceData>) => {
      return res;
    });
};
export default GlobalAnnouncementSystemGet;
