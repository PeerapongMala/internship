package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"
)

func (postgresRepository *postgresRepository) AddShopItem(c constant.ShopItemRequest) (r constant.ShopItemResponse, err error) {
	var result interface{}

	query := `SELECT id FROM "item"."item" WHERE id = $1 AND type = $2 LIMIT 1`
	err = postgresRepository.Database.Get(&result, query, c.ItemId, c.Type)
	if err != nil {
		return r, err
	}

	r.Type = *c.Type

	query = `INSERT INTO "inventory"."inventory_item"
			(
			inventory_id,
			item_id,
			amount,
			is_equipped
			)
			VALUES
			(
				(SELECT id 
				FROM "inventory"."inventory"
				WHERE student_id= $1),
				$2,
				$3,
				false
			)
			RETURNING inventory_id, item_id, amount`
	err = postgresRepository.Database.Get(&r, query, c.StudentId, c.ItemId, c.Amount)
	if err != nil {
		return r, err
	}

	return r, nil

}
