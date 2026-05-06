package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SeedAcademicYearList(teacherId string) ([]int, error) {
	query := `
		SELECT
			"name"
		FROM
			"school"."academic_year_range"
		WHERE
		    "school_id" = (
				SELECT "school_id" FROM "school"."school_teacher" WHERE "user_id" = $1 LIMIT 1        
			)
		ORDER BY "name" DESC
`
	academicYears := []int{}
	err := postgresRepository.Database.Select(&academicYears, query, teacherId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return academicYears, nil
}
