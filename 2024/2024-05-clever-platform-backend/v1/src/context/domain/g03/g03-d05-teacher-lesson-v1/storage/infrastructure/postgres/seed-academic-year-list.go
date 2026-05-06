package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SeedAcademicYearList(pagination *helper.Pagination, teacherId string) ([]int, error) {
	query := `
		SELECT
			"name"
		FROM
			"school"."academic_year_range"
		WHERE
			school_id = (
				SELECT
					"school_id"
				FROM
					"school"."school_teacher"
				WHERE
					"user_id" = $1
			)	
	`
	args := []interface{}{teacherId}
	argsIndex := len(args) + 1

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "name" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	academicYears := []int{}
	err := postgresRepository.Database.Select(&academicYears, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return academicYears, nil
}
