package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LevelCaseGetStatus(levelId int) (*string, error) {
	query := `
		SELECT
			"status"
		FROM
		    "level"."level"
		WHERE
		    "id" = $1
	`
	var status string
	err := postgresRepository.Database.QueryRowx(query, levelId).Scan(&status)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &status, nil
}
