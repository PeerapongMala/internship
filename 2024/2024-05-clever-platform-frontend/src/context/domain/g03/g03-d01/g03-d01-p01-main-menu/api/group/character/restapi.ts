// ./group/character/restapi.ts
import { DataAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth, updateWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { Character, CharacterResponse } from '../../../../../g03-d04/local/types';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const RestAPICharacter = {
  CharacterAll: {
    Get(): Promise<DataAPIResponse<CharacterResponse[]>> {
      const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/character`;
      return fetchWithAuth(url, { method: 'GET' }).then((res) => res.json());
    },
  },
  UpdateCharacter: {
    Patch(
      avatarId: number | undefined,
      isEquipped: boolean,
    ): Promise<DataAPIResponse<Character>> {
      const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/character`;
      const updatedCharacter = {
        avatar_id: avatarId,
        is_equipped: isEquipped,
      };
      return updateWithAuth(url, updatedCharacter).then((res) => res.json());
    },
  },
};

export default RestAPICharacter;
