import { BaseAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const GlobalAnnouncementReadByIdPatch = (
  announcementId: number,
): Promise<BaseAPIResponse> => {
  const url = `${backendURL}/global-announcement/v1/announcement/${announcementId}`;
  return fetchWithAuth(url, {
    method: 'PATCH',
  })
    .then((res) => res.json())
    .then((res: BaseAPIResponse) => {
      return res;
    });
};

export default GlobalAnnouncementReadByIdPatch;
