package postgres

import (
	"database/sql"
	"github.com/pkg/errors"
	"log"
	"time"
)

func (postgresRepository *postgresRepository) CurrentAcademicYearGet(schoolId int) (*int, error) {
	query := `
		SELECT
			"name"::integer
		FROM
		    "school"."academic_year_range" ayr
		WHERE "ayr"."school_id" = $1
			AND $2 BETWEEN "ayr"."start_date" AND "ayr"."end_date"
		ORDER BY "name" DESC LIMIT 1
	`
	var academicYear *int
	err := postgresRepository.Database.QueryRow(query, schoolId, time.Now().UTC()).Scan(&academicYear)
	if err != nil && err != sql.ErrNoRows {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return academicYear, nil
}
