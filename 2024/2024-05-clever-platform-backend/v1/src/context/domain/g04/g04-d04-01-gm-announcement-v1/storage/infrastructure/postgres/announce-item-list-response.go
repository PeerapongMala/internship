package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"

func (postgresRepository *postgresRepository) ItemList(announceId int) ([]constant.ItemList, error) {
	query := `
	SELECT
	"ari"."item_id",
	"i"."name" AS "item_name",
	"i"."type",
	"ari"."amount",
	"ari"."expired_at",
	"i"."image_url" AS "item_image_url",
	"i"."updated_at",
	"u"."first_name" AS "updated_by"
	FROM "announcement"."announcement_reward_item" ari
	LEFT JOIN "item"."item" i
	ON "ari"."item_id" = "i"."id"
	LEFT JOIN "user"."user" u
	ON "i"."updated_by" = "u"."id"
	WHERE "ari"."announcemnet_reward_id" = $1

	`
	rows, err := postgresRepository.Database.Query(query, announceId)
	if err != nil {
		return nil, err
	}
	responses := []constant.ItemList{}
	for rows.Next() {
		response := constant.ItemList{}
		rows.Scan(
			&response.ItemId,
			&response.ItemName,
			&response.Type,
			&response.Amount,
			&response.ExpiredAt,
			&response.ImageUrl,
			&response.UpdatedAt,
			&response.UpdatedBy,
		)
		responses = append(responses, response)
	}
	return responses, nil
}
