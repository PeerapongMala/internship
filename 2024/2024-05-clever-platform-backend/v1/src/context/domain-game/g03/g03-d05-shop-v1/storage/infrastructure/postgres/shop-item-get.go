package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"

func (postgresRepository *postgresRepository) GetShopItem(c constant.ShopItemRequest) (r constant.ShopItemResponse, err error) {
	query := `
		SELECT
			inv_item.inventory_id, 
			inv_item.item_id,
			item.type,
			inv_item.amount
		FROM "inventory"."inventory_item" as inv_item
		LEFT JOIN "item"."item" as item ON inv_item.item_id = item.id
		WHERE
			inv_item.inventory_id = (SELECT id FROM inventory.inventory WHERE student_id = $1)
			AND inv_item.item_id = $2
			AND item.type = $3
	`

	err = postgresRepository.Database.Get(&r, query, c.StudentId, c.ItemId, c.Type)
	if err != nil {
		return r, err
	}
	return r, nil
}
