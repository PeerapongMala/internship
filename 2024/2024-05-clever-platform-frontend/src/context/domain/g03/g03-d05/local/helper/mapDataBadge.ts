import { getAssetPath } from '@global/helper/assetsGateway';
import { BadgeOutput, BadgeResponse } from '../type';

export const mapBadgeResponseToOutput = (
  badge: BadgeResponse,
  index: number,
  allBadges: BadgeResponse[],
): BadgeOutput => {
  // Sort badges by price to determine progression order
  const sortedBadges = [...allBadges].sort((a, b) => a.price - b.price);

  // Find the position of current badge in the sorted order
  const currentBadgePosition = sortedBadges.findIndex((b) => b.id === badge.id);

  // Determine if this badge should be unlocked based on progression
  let shouldBeUnlocked = false;

  // Always unlock purchased badges
  if (badge.is_bought) {
    shouldBeUnlocked = true;
  }
  // Unlock the first badge in progression if not purchased
  else if (currentBadgePosition === 0) {
    shouldBeUnlocked = true;
  }
  // Check if the previous badge in the sorted order is purchased
  else if (currentBadgePosition > 0) {
    const previousBadge = sortedBadges[currentBadgePosition - 1];
    shouldBeUnlocked = previousBadge.is_bought;
  }

  console.log('badge res: ', badge);
  return {
    id: badge.id,
    stock: badge.stock,
    initial_stock: badge.initial_stock,
    price: badge.price,
    item_id: badge.item_id,
    name: badge.name,
    description: badge.description,
    image_url: badge.image_url,
    template_path: badge.template_path,
    badge_description: badge.badge_description,
    amount: badge.amount,
    is_bought: badge.is_bought,
    is_equipped: badge.is_equipped,
    selected: true || badge.is_equipped,
    src: badge.name || getAssetPath('pet', 'frame_1', '.svg'),
    lock: false, // Set lock based on our unlocking logic
    buy: badge.is_bought,
  };
};
