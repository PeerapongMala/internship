import { DataAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth, updateWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { Avatar, AvatarResponse } from '../../../types';
import mockCharacter from './mock_character.json';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

export const GetAllCharacter = async (): Promise<DataAPIResponse<AvatarResponse[]>> => {
  const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/character`;
  const res = await fetchWithAuth(url, {
    method: 'GET',
  });
  const res_1 = await res.json();
  console.log('Character API response: ', res_1);

  // Fallback: Return mock data if the API response is null or missing the data property.
  if (!res_1 || res_1.data == null) {
    console.warn('API returned null data, falling back to mockCharacter');
    return mockCharacter as DataAPIResponse<AvatarResponse[]>;
  }
  return res_1;
};

export const UpdateCharacter = async (
  avatarId: number | undefined,
  isEquipped: boolean,
): Promise<DataAPIResponse<Avatar>> => {
  const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/character`;
  const updatedCharacterPayload = {
    avatar_id: avatarId,
    is_equipped: isEquipped,
  };

  const res = await updateWithAuth(url, updatedCharacterPayload);
  const res_1 = await res.json();
  console.log('UpdateCharacter API response: ', res_1);

  // Check if the API response is invalid or missing data.
  if (!res_1 || res_1.data == null) {
    console.warn('API update returned null data, falling back to mockCharacter');

    // Parse the mock data (mockCharacter.data is expected to be an array)
    //const fallbackData: Avatar[] = mockCharacter.data;
    // let characterToUpdate: Avatar | undefined;

    // // If an avatarId is provided, try to identify the character that needs to be updated.
    // if (avatarId !== undefined) {
    //   characterToUpdate = fallbackData.find((item) => item.avatar_id === avatarId);
    // }

    // // If no matching character is found or avatarId is undefined,
    // // use the first character object from the mock data as a fallback.
    // if (!characterToUpdate) {
    //   characterToUpdate = fallbackData[0];
    // }

    // // Simulate updating the character's is_equipped property.
    // const updatedMockCharacter: Avatar = {
    //   ...characterToUpdate,
    //   is_equipped: isEquipped,
    // };

    // Return the updated character in the defined API response structure.
    // return {
    //   status_code: 200,
    //   message: 'success (mock update)',
    //   data: updatedMockCharacter,
    //   error: null,
    // } as DataAPIResponse<Avatar>;
  }

  // If the API response is valid, simply return it.
  return res_1;
};
