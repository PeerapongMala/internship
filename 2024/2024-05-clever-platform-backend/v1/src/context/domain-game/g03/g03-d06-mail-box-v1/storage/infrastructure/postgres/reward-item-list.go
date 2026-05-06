package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"

func (postgresRepository *postgresRepository) RewardItemList(announceId int) ([]constant.ItemList, error) {
	query := `
	SELECT
	"i"."id" AS "item_id",
	"i"."type" AS "item_type",
	"i"."name" AS "item_name",
	"i"."description" AS "item_description",
	"i"."image_url" AS "item_image",
	"ari"."amount",
	"ari"."expired_at" AS "item_expired_at"
	FROM "announcement"."announcement_reward_item" ari
	LEFT JOIN "item"."item" i 
	ON "ari"."item_id" = "i"."id"
	WHERE "ari"."announcemnet_reward_id" = $1
	
	`
	rows, err := postgresRepository.Database.Queryx(query, announceId)
	if err != nil {
		return nil, err
	}
	responses := []constant.ItemList{}
	for rows.Next() {
		response := constant.ItemList{}
		err := rows.StructScan(&response)
		if err != nil {
			return nil, err
		}
		responses = append(responses, response)
	}
	return responses, nil
}
