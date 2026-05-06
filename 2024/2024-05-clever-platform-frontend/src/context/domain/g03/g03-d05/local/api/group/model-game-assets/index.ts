import { DataAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth } from '@global/helper/fetch';
import { downloadAndExtractZip, ZipResponse } from '@global/helper/zipDownload';
import StoreGlobal from '@store/global';
import { ModelAvatar } from '../../../type';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

export const GetAvatarModelAssets = async (): Promise<DataAPIResponse<ModelAvatar[]>> => {
  const url = `${backendURL}/game-arriving/v1/game-assets/zip`;
  const res = await fetchWithAuth(url, {
    method: 'GET',
  });
  const res_1 = await res.json();

  // Transform the response to match the DataAPIResponse<ModelAvatar[]> type
  const transformedResponse: DataAPIResponse<ModelAvatar[]> = {
    status_code: res_1.status_code === 200 ? 200 : 201, // Ensure it's either 200 or 201
    message: res_1.message,
    data: res_1.data, // This should be an array of ModelAvatar objects
  };

  console.log('Shop avatar API response: ', transformedResponse);

  return transformedResponse;
};

export const GetAvatarModelAssetsZip = (): Promise<ZipResponse<ModelAvatar[]>> => {
  return downloadAndExtractZip(`${backendURL}/game-arriving/v1/game-assets/zip`);
};
