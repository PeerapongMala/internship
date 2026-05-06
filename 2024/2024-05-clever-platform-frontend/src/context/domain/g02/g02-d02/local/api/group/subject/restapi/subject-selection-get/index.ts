import { DataAPIResponse } from '@core/helper/api-type';
import { SubjectListItem } from '@domain/g02/g02-d02/local/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const SubjectSelectionGet = (): Promise<DataAPIResponse<SubjectListItem[]>> => {
  const url = `${backendURL}/global-zone/v1/select-subject`;
  return fetchWithAuth(url, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res: DataAPIResponse<SubjectListItem[]>) => {
      return res;
    });
};

export default SubjectSelectionGet;
