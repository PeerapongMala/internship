package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"

func (postgresRepository *postgresRepository) GetShopAvatarLists(studentId string) (r []constant.ShopAvatar, err error) {
	query := `
		WITH
			inventory_avatars AS (
				SELECT
					a.model_id,
					ia.is_equipped
				FROM
					inventory.inventory_avatar ia
					LEFT JOIN inventory.inventory i ON ia.inventory_id = i.id
					LEFT JOIN game.avatar a ON ia.avatar_id = a.id
				WHERE
					i.student_id = $1
			),
			avatars AS (
				SELECT
					a.id,
					a.model_id,
					sp.price
				FROM
					game.avatar a
					LEFT JOIN game.shop_price sp ON a.model_id = sp.model_id
			)
		SELECT
		    a.id,
			a.model_id,
			a.price,
			COALESCE(ia.is_equipped, FALSE) AS is_equipped,
			CASE
				WHEN ia.model_id IS NOT NULL THEN TRUE
				ELSE FALSE
			END AS is_bought
		FROM
			avatars a
			LEFT JOIN inventory_avatars ia ON a.model_id = ia.model_id;
	`

	err = postgresRepository.Database.Select(&r, query, studentId)
	if err != nil {
		return r, err
	}
	return r, nil
}
