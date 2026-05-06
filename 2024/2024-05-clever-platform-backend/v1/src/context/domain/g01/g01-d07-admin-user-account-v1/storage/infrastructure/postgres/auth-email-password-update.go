package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthEmailPasswordUpdate(auth *constant.AuthEmailPasswordEntity) error {
	query := `
		UPDATE
			"auth"."auth_email_password"	
		SET
			"password_hash" = $1
		WHERE
			"user_id" = $2
	`
	_, err := postgresRepository.Database.Exec(
		query,
		auth.PasswordHash,
		auth.UserId,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
