package postgres

import (
	"database/sql"
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ClassroomAcademicYearGet(schoolId int) ([]string, error) {
	query := `
		SELECT
			"academic_year"
		FROM "class"."class"
		WHERE "school_id" = $1
		GROUP BY academic_year
	`

	var academicYears []string
	err := postgresRepository.Database.Select(&academicYears, query, schoolId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return academicYears, nil
}
