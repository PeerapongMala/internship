import { DataAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth, updateWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { BadgeOutput, BadgeResponse } from '../../../types';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

export const ItemBadgeAll = async (): Promise<DataAPIResponse<BadgeOutput[]>> => {
  const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/item-badge`;
  const res = await fetchWithAuth(url, {
    method: 'GET',
  });
  const res_1 = await res.json();
  console.log(res_1);
  return res_1;
};

export const UpdateItemBadge = async (
  itemId: number | undefined,
  isEquipped: boolean,
): Promise<DataAPIResponse<BadgeOutput>> => {
  const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/item-badge`;

  console.log('itemId: ', itemId);

  // CASE 1: Special logic when itemId is 0 → means "unequip currently equipped badge"
  if (itemId === 0) {
    try {
      // 1. GET all badges to find the currently equipped one
      const res = await fetchWithAuth(url);
      const data = await res.json();
      console.log('GET badge res:', res);
      console.log('status:', res.status);
      console.log('badge data:', data);

      const equippedBadge = data?.data?.find(
        (badge: BadgeResponse) => badge.is_equipped === true,
      );

      if (!equippedBadge) {
        console.warn('No badge is currently equipped.');
        return {
          status_code: 200,
          message: 'No badge to unequip.',
          data: {} as BadgeOutput,
        };
      }

      // 2. PATCH the found badge to set is_equipped: false
      const unequipPayload = {
        item_id: equippedBadge.item_id,
        is_equipped: false,
      };

      const unequipRes = await updateWithAuth(url, unequipPayload);
      const unequipData = await unequipRes.json();
      console.log('Unequipped Badge:', unequipData);

      return unequipData;
    } catch (err) {
      console.error('Failed to unequip badge:', err);
      return {
        status_code: 500,
        message: 'Failed to unequip badge',
        data: null,
        error: err,
      } as DataAPIResponse<BadgeOutput>;
    }
  }

  // CASE 2: Normal badge update when itemId !== 0
  const updatedItemBadge = {
    item_id: itemId,
    is_equipped: isEquipped,
  };

  try {
    const res = await updateWithAuth(url, updatedItemBadge);
    const res_1 = await res.json();
    console.log('Updated Badge:', res_1);
    return res_1;
  } catch (err) {
    console.error('Failed to update badge:', err);
    return {
      status_code: 500,
      message: 'Failed to update badge',
      data: null,
      error: err,
    } as DataAPIResponse<BadgeOutput>;
  }
};
