package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"
)

func (postgresRepository *postgresRepository) AddShopAvatar(c constant.ShopRequest) (r constant.ShopResponse, err error) {

	query := `INSERT INTO "inventory"."inventory_avatar"
			(inventory_id, avatar_id, is_equipped) 
			values ( (SELECT id 
			FROM "inventory"."inventory"
			WHERE student_id = $1), $2,false)
			RETURNING inventory_id, avatar_id`

	err = postgresRepository.Database.QueryRow(query, c.StudentId, c.AvatarId).Scan(&r.InventoryId, &r.AvatarId)
	if err != nil {
		return r, err
	}
	return r, nil
}
