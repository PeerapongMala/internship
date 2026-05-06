import { DataAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth, updateWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { Pet } from '../../../types';
import mockPet from './mock_pet.json';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

export const GetAllPet = async (): Promise<DataAPIResponse<Pet[]>> => {
  const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/pet`;
  const res = await fetchWithAuth(url, {
    method: 'GET',
  });
  const res_1 = await res.json();
  console.log('Pet API response: ', res_1);

  // If the API returns null or if the data property is null/undefined, fall back to mock data.

  return res_1;
};

export const UpdatePet = async (
  petId: number | undefined,
  isEquipped: boolean,
): Promise<DataAPIResponse<Pet>> => {
  const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/pet`;

  // If petId is 0, we need to find the currently equipped pet and unequip it
  if (petId === 0) {
    const res = await fetchWithAuth(url);
    const resJson = await res.json();

    console.log('Full pet list response:', resJson);

    const petList: Pet[] = resJson?.data ?? [];

    const equippedPet = petList.find((pet) => pet.is_equipped === true);

    if (!equippedPet) {
      console.warn('No currently equipped pet found.');
      return {
        status_code: 200,
        message: 'No pet to unequip.',
        data: {} as Pet,
      };
    }

    console.log('equippedPet.id: ', equippedPet.pet_id);

    const unequipPayload = {
      pet_id: equippedPet.pet_id,
      is_equipped: false,
    };

    const unequipRes = await updateWithAuth(url, unequipPayload);
    const unequipData = await unequipRes.json();
    console.log('Unequipped Pet:', unequipData);
    return unequipData;
  }

  // Normal case: just update the given petId
  const updatedPet = {
    pet_id: petId,
    is_equipped: isEquipped,
  };
  const res = await updateWithAuth(url, updatedPet);
  const result = await res.json();
  console.log('Updated Pet:', result);
  return result;
};
