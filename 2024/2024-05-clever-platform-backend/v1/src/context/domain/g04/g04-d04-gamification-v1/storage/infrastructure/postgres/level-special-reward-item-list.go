package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LevelSpecialRewardItemList(filter *constant.LevelSpecialRewardItemFilter, pagination *helper.Pagination) ([]constant.LevelSpecialRewardItemEntity, error) {
	query := `
		SELECT
			"lsr"."id",
			"i"."image_url",
			"i"."name",
			"i"."type",
			"i"."description",
			"lsr"."amount",
			"i"."updated_at",
			"u"."first_name" AS "updated_by",
			"i"."status"
		FROM
		    "level"."level_special_reward" lsr
		LEFT JOIN
			"item"."item" i
			ON "lsr"."item_id" = "i"."id"
		LEFT JOIN
			"user"."user" u
			ON "i"."updated_by" = "u"."id"
		WHERE
		    TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if filter.LevelId != 0 {
		log.Println(filter.LevelId)
		query += fmt.Sprintf(` AND "lsr"."level_id" = $%d`, argsIndex)
		args = append(args, filter.LevelId)
		argsIndex++
	}
	if filter.ItemId != 0 {
		query += fmt.Sprintf(` AND "lsr"."item_id" = $%d`, argsIndex)
		args = append(args, filter.ItemId)
		argsIndex++
	}
	if filter.Type != "" {
		query += fmt.Sprintf(` AND "i"."type" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Type+"%")
		argsIndex++
	}
	if filter.Description != "" {
		query += fmt.Sprintf(` AND "i"."description" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Description+"%")
		argsIndex++
	}
	if filter.Amount != 0 {
		query += fmt.Sprintf(` AND "lsr"."amount" = $%d`, argsIndex)
		args = append(args, filter.Amount)
		argsIndex++
	}
	if filter.Name != "" {
		query += fmt.Sprintf(` AND "i"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Name+"%")
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		log.Println(countQuery)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "i"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	levelSpecialRewardItemEntities := []constant.LevelSpecialRewardItemEntity{}
	err := postgresRepository.Database.Select(&levelSpecialRewardItemEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return levelSpecialRewardItemEntities, nil
}
