package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) TemplateItemList(pagination *helper.Pagination, itemType string) ([]constant.TemplateItemEntity, error) {
	query := `
		SELECT
			"i"."id",
			"i"."image_url",
			"i"."name",
			"b"."template_path",
			"b"."badge_description",
			"i"."description"
		FROM
			"item"."item" i
		LEFT JOIN	
			"item"."badge" b
			ON "i"."id" = "b"."item_id"
		WHERE
			"teacher_item_group_id" IS NULL
			AND "type" = $1
			AND "status" = $2
	`
	if itemType == "" {
		itemType = constant.Badge
	}

	log.Println(itemType)
	args := []interface{}{itemType, "enabled"}
	argsIndex := len(args) + 1

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "i"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	itemEntities := []constant.TemplateItemEntity{}
	err := postgresRepository.Database.Select(&itemEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return itemEntities, nil
}
