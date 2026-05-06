package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SeedYearList(pagination *helper.Pagination) ([]constant.SeedYearEntity, error) {
	query := `
		SELECT
			"id",
			"name",
			"short_name"
		FROM
		    "curriculum_group"."seed_year"
	`
	args := []interface{}{}
	argsIndex := 1

	if pagination != nil {
		countQuery := fmt.Sprintf(` SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	seedYearEntities := []constant.SeedYearEntity{}
	err := postgresRepository.Database.Select(&seedYearEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return seedYearEntities, nil
}
