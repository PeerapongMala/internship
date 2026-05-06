package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"
)

func (postgresRepository *postgresRepository) GetShopPetLists(studentId string) (r []constant.ShopPet, err error) {
	query := `
		WITH inventory_pets AS (
			SELECT
				p.model_id,
				ip.is_equipped
			FROM
				inventory.inventory_pet ip
				LEFT JOIN inventory.inventory i ON ip.inventory_id = i.id
				LEFT JOIN game.pet p ON ip.pet_id = p.id
			WHERE
				i.student_id = $1
		),
		pets AS (
			SELECT
			    p.id,
				p.model_id,
				sp.price
			FROM
				game.pet p
				LEFT JOIN game.shop_price sp ON p.model_id = sp.model_id
		)
		SELECT
		    p.id,
			p.model_id,
			p.price,
			COALESCE(ip.is_equipped, FALSE) AS "is_equipped",
			CASE
				WHEN ip.model_id IS NOT NULL THEN TRUE
				ELSE FALSE
			END AS is_bought
		FROM
			pets p
			LEFT JOIN inventory_pets ip ON p.model_id = ip.model_id;
	`
	if err = postgresRepository.Database.Select(&r, query, studentId); err != nil {
		log.Printf("err: %s", err.Error())
		return r, err
	}

	return r, nil

}
