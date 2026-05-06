package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/constant"
)

func (postgresRepository *postgresRepository) GetCustomAvatarItemBadge(c constant.GetInventoryAvatarItemRequest) (r []constant.InventoryAvatarItemBadgeEntity, err error) {

	query := `SELECT
		inv_item.*, item.image_url, badge.template_path, badge.badge_description, item.status
	FROM
		inventory.inventory_item inv_item 
	LEFT JOIN 
		inventory.inventory inv ON inv_item.inventory_id = inv.id
	LEFT JOIN
		item.item item on inv_item.item_id = item.id
	LEFT JOIN
		item.badge badge on item.id = badge.item_id
	WHERE
		inv.student_id = $1
		AND item.type = $2`

	err = postgresRepository.Database.Select(&r, query, c.StudentId, c.Type)
	if err != nil {
		return r, err
	}

	return r, nil
}
