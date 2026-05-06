import { DataAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth, updateWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { Character, CharacterResponse } from '../../../type';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

export const GetAllCharacter = async (): Promise<
  DataAPIResponse<CharacterResponse[]>
> => {
  const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/character`;
  const res = await fetchWithAuth(url, {
    method: 'GET',
  });
  const res_1 = await res.json();
  console.log(res_1);
  return res_1;
};

export const UpdateCharacter = async (
  avatarId: number | undefined,
  isEquipped: boolean,
): Promise<DataAPIResponse<Character>> => {
  const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/character`;
  const updatedCharacter = {
    avatar_id: avatarId,
    is_equipped: isEquipped,
  };
  const res = await updateWithAuth(url, updatedCharacter);
  const res_1 = await res.json();
  console.log(res_1);
  return res_1;
};
