package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SeedAcademicYearList(pagination *helper.Pagination) ([]int, error) {
	query := `
		SELECT
			"academic_year"
		FROM
		    "school"."seed_academic_year"
`
	args := []interface{}{}
	argsIndex := 1

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s) `, query)
		query += fmt.Sprintf(` ORDER BY "academic_year" OFFSET $1 LIMIT $2`)

		err := postgresRepository.Database.QueryRowx(countQuery).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		args = append(args, pagination.Offset, pagination.Limit)
		argsIndex += 2
	}

	seedAcademicYearEntities := []int{}
	err := postgresRepository.Database.Select(&seedAcademicYearEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return seedAcademicYearEntities, nil
}
