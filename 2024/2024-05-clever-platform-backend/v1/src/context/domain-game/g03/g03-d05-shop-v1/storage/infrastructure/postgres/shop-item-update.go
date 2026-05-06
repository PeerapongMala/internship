package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"

func (postgresRepository *postgresRepository) UpdateShopItem(c constant.ShopItemRequest) (r constant.ShopItemResponse, err error) {
	var count interface{}

	query := `SELECT id FROM "item"."item" WHERE id = $1 AND type = $2`
	if err = postgresRepository.Database.Get(&count, query, c.ItemId, c.Type); err != nil {
		return r, err
	}

	r.Type = *c.Type
	updateQuery := `UPDATE "inventory"."inventory_item"
				SET amount = $1
				WHERE inventory_id = (SELECT id 
				FROM "inventory"."inventory"
				WHERE student_id= $2) AND item_id = $3
				RETURNING inventory_id, item_id, amount`

	err = postgresRepository.Database.Get(&r, updateQuery, c.Amount, c.StudentId, c.ItemId)
	if err != nil {
		return r, err
	}

	return r, nil

}
