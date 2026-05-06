package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ClassGetByAcademicYearYearName(tx *sqlx.Tx, schoolId, academicYear int, year string, name string) (int, error) {
	query := `
		SELECT
			"id"
		FROM "class"."class" c
		WHERE
			"school_id" = $1
			AND "academic_year" = $2
			AND "year" = $3
			AND "name" = $4
	`
	var classId int
	err := tx.QueryRowx(query, schoolId, academicYear, year, name).Scan(&classId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}

	return classId, nil
}
