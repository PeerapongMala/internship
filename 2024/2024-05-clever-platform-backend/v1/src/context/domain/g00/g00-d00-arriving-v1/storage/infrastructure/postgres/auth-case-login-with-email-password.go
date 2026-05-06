package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthCaseLoginWithEmailPassword(userId string) (*string, error) {
	query := `
		SELECT
			"password_hash"	
		FROM "auth"."auth_email_password"
		WHERE
			"user_id" = $1
	`
	var passwordHash string
	err := postgresRepository.Database.QueryRowx(
		query,
		userId,
	).Scan(&passwordHash)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &passwordHash, nil
}
