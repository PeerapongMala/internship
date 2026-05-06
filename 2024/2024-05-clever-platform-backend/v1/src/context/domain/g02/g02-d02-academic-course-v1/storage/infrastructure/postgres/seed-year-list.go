package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SeedYearList(pagination *helper.Pagination) ([]constant.SeedYearEntity, error) {
	query := `
		SELECT
			*
		FROM "curriculum_group"."seed_year"
	`
	args := []interface{}{}
	argsIndex := 1

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s) `, query)
		query += fmt.Sprintf(` ORDER BY id OFFSET $1 LIMIT $2`)

		err := postgresRepository.Database.QueryRowx(countQuery).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		args = append(args, pagination.Offset, pagination.Limit)
		argsIndex += 2
	}

	seedYearEntities := []constant.SeedYearEntity{}
	err := postgresRepository.Database.Select(&seedYearEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return seedYearEntities, nil
}
