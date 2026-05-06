import { DataAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth, updateWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { Frame, FrameResponse } from '../../../types';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

export const GetAllFrame = async (): Promise<DataAPIResponse<FrameResponse[]>> => {
  const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/item-frame`;
  const res = await fetchWithAuth(url, {
    method: 'GET',
  });
  const res_1 = await res.json();
  console.log('Frame API response: ', res_1);

  // Fallback: Return mock data if the API response is null or missing the data property.
  //   if (!res_1 || res_1.data == null) {
  //     console.warn('API returned null data, falling back to mockCharacter');
  //     return mockCharacter as DataAPIResponse<FrameResponse[]>;
  //   }
  return res_1;
};

export const UpdateFrame = async (
  item_id: number | undefined,
  isEquipped: boolean,
): Promise<DataAPIResponse<Frame>> => {
  const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/item-frame`;

  // 1. Invalid only if undefined or null
  if (item_id === undefined || item_id === null) {
    console.error('Invalid item_id, cannot proceed with UpdateFrame');
    return {
      status_code: 400,
      message: 'Invalid item_id',
      data: {} as Frame,
      error: 'Missing or invalid item_id',
    };
  }

  try {
    // 2. Special case: item_id = 0 → unequip the currently equipped frame
    if (item_id === 0) {
      // fetch full list
      const listRes = await fetchWithAuth(url);
      const listJson = await listRes.json();
      console.log('Full frame list response:', listJson);

      const frameList: Frame[] = Array.isArray(listJson?.data) ? listJson.data : [];
      const equippedFrame = frameList.find((f) => f.is_equipped === true);

      if (!equippedFrame) {
        console.warn('No currently equipped frame found.');
        return {
          status_code: 200,
          message: 'No frame to unequip.',
          data: {} as Frame,
        };
      }

      console.log('Currently equipped frame ID:', equippedFrame.item_id);
      const unequipPayload = {
        item_id: equippedFrame.item_id,
        is_equipped: false,
      };
      console.log('Payload to unequip frame:', unequipPayload);

      const unequipRes = await updateWithAuth(url, unequipPayload);
      const unequipJson = await unequipRes.json();
      console.log('Unequipped Frame response:', unequipJson);
      return unequipJson;
    }

    // 3. Normal update case
    const updatedFramePayload = {
      item_id,
      is_equipped: isEquipped,
    };
    console.log('Payload being sent to UpdateFrame:', updatedFramePayload);

    const res = await updateWithAuth(url, updatedFramePayload);
    const resJson = await res.json();
    console.log('UpdateFrame API response:', resJson);
    return resJson;
  } catch (error) {
    console.error('Error during UpdateFrame API call:', error);
    return {
      status_code: 500,
      message: 'API call failed',
      data: {} as Frame,
      error: (error as Error).message,
    };
  }
};
