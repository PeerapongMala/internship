package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
)

func (postgresRepository *postgresRepository) GetItem(id int) (*constant.ItemResponse, error) {
	response := &constant.ItemResponse{}
	query := `
			SELECT 
			"item"."id",
			"item"."teacher_item_group_id",
			"item"."type",
			"item"."name",
			"item"."description",
			"item"."image_url",
			"item"."status",
			"item"."created_at",
			"item"."created_by",
			u2."first_name" AS "created_name",
			"item"."updated_at",
			u."first_name" AS "updated_by" 
			FROM "item"."item" 
			LEFT JOIN "user"."user" u ON "item"."item".updated_by = u.id
			LEFT JOIN "user"."user" u2 ON "item"."item".created_by = u2.id
			WHERE "item".id = $1`
	err := postgresRepository.Database.Get(response, query, id)
	if err != nil {
		return nil, err
	}

	return response, nil
}
