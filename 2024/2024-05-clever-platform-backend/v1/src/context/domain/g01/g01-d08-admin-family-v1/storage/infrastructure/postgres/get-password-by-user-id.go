package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthPasswordGetByUserId(userID string) (*string, error) {
	query := `
		SELECT
			password_hash
		FROM "auth"."auth_email_password"
		WHERE
			"user_id" = $1
	`

	args := []interface{}{userID}
	var passwordHash string
	err := postgresRepository.Database.QueryRowx(query, args...).Scan(&passwordHash)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &passwordHash, nil
}
