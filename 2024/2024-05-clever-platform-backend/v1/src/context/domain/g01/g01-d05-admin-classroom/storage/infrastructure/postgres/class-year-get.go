package postgres

import (
	"database/sql"
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ClassYearGet(schoolId int) ([]string, error) {
	query := `
		SELECT
			"year"
		FROM "class"."class"
		WHERE "school_id" = $1
		GROUP BY year
	`

	var years []string
	err := postgresRepository.Database.Select(&years, query, schoolId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return years, nil
}
