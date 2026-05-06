package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ClassList(seedYearShortName string, schoolId, academicYear int) ([]string, error) {
	query := `
		SELECT
			"c"."name"
		FROM
			"class"."class" c
		WHERE
			"c"."school_id" = $1
			AND
			"c"."academic_year" = $2
			AND
			"c"."year" = $3
	`
	classes := []string{}
	err := postgresRepository.Database.Select(&classes, query, schoolId, academicYear, seedYearShortName)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return classes, nil
}
