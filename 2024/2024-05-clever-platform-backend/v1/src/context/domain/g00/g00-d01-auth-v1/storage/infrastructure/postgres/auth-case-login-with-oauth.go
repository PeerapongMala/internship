package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthCaseLoginWithOAuth(subjectId string) (*string, error) {
	query := `
		SELECT
			"user_id"
		FROM "auth"."auth_oauth"	
		WHERE
			"subject_id" = $1
	`
	var userId string
	err := postgresRepository.Database.QueryRowx(
		query,
		subjectId,
	).Scan(&userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &userId, nil
}
