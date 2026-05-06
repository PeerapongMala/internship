package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthCaseUpdatePassword(userId, passwordHash string) error {
	query := `
		UPDATE "auth"."auth_email_password"	
		SET "password_hash" = $1
		WHERE
			"auth"."auth_email_password"."user_id" = $2
	`
	_, err := postgresRepository.Database.Exec(
		query,
		passwordHash,
		userId,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
