import { responseOk } from '@core/helper/api-mock';
import { BaseAPIResponse } from '@core/helper/api-type';

const GlobalAnnouncementReadByIdPatch = (
  announcementId: number,
): Promise<BaseAPIResponse> => {
  return Promise.resolve(responseOk({ data: undefined, message: 'announcement read' }));
};
export default GlobalAnnouncementReadByIdPatch;
