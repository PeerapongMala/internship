import { BaseAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const GlobalAnnouncementReadAllSystemPost = (): Promise<BaseAPIResponse> => {
  const url = `${backendURL}/global-announcement/v1/announcement/system`;
  return fetchWithAuth(url, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((res: BaseAPIResponse) => {
      return res;
    });
};

export default GlobalAnnouncementReadAllSystemPost;
