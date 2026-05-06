package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SchoolCaseCheckExistence(schoolCode string) (*bool, error) {
	query := `
		SELECT EXISTS (
			SELECT
				1
			FROM
			    "school"."school"
			WHERE
			    "school"."code" = $1
		)
	`
	var isExists *bool
	err := postgresRepository.Database.QueryRowx(query, schoolCode).Scan(&isExists)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return isExists, nil
}
