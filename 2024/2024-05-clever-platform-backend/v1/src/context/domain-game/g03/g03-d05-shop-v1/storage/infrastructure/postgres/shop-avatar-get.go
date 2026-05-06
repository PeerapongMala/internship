package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"

func (postgresRepository *postgresRepository) GetShopAvatar(studentId string, avatarId int) (r constant.ShopResponse, err error) {

	query := `SELECT inv_avatar.inventory_id, inv_avatar.avatar_id , avatar.model_id
			FROM "inventory"."inventory_avatar" as inv_avatar
			LEFT JOIN game.avatar as avatar on inv_avatar.avatar_id = avatar.id
			WHERE inv_avatar.inventory_id = (SELECT id FROM inventory.inventory WHERE student_id = $1) 
			AND inv_avatar.avatar_id = $2`

	err = postgresRepository.Database.Get(&r, query, studentId, avatarId)
	if err != nil {
		return r, err
	}
	return r, nil
}
