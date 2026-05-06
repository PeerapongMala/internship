package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ItemList(filter *constant.ItemFilter, pagination *helper.Pagination) ([]constant.ItemEntity, error) {
	query := `
		SELECT
			"i"."id",
			"i"."name",
			"i"."image_url",
			"i"."type",
			"i"."description"
		FROM
		    "item"."item" i
		WHERE
		    TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if filter.Type != "" {
		query += fmt.Sprintf(` AND "i"."type" = $%d`, argsIndex)
		args = append(args, filter.Type)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "i"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	itemEntities := []constant.ItemEntity{}
	err := postgresRepository.Database.Select(&itemEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return itemEntities, nil
}
