package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/constant"
)

func (postgresRepository *postgresRepository) UpdateCustomAvatarItemCouponEquipped(c constant.UpdateCustomAvatarItemEquippedRequest) (r constant.InventoryAvatarItemEntity, err error) {
	// reset another inventory_avatar is_equipped = false
	queryUpdate := `UPDATE inventory.inventory_item as inv_item
					SET is_equipped  = false  
					WHERE (select item.type from item.item as item where item.id = inv_item.item_id) = 'coupon'
					AND inv_item.item_id <> $1 
					AND inv_item.inventory_id = (SELECT id FROM inventory.inventory WHERE student_id = $2)`

	_, err = postgresRepository.Database.Exec(queryUpdate, c.ItemId, c.StudentId)
	if err != nil {
		return r, err
	}

	queryUpdate = `UPDATE inventory.inventory_item as inv_item
					SET is_equipped = $1
					WHERE (select item.type from item.item as item where item.id = inv_item.item_id) = 'coupon'
					AND inv_item.item_id = $2 
					AND inv_item.inventory_id = (SELECT id FROM inventory.inventory WHERE student_id = $3)
					RETURNING  amount , inventory_id, item_id, is_equipped`

	err = postgresRepository.Database.QueryRow(queryUpdate, c.IsEquipped, c.ItemId, c.StudentId).Scan(&r.Amount, &r.InventoryId, &r.ItemId, &r.IsEquipped)
	if err != nil {
		return r, err
	}

	return r, nil
}
