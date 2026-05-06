package postgres

import (
	"database/sql"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthCaseAddUserAuthEmailPassword(tx *sqlx.Tx, auth *constant.AuthEmailPasswordEntity) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()
	query := `
		INSERT INTO "auth"."auth_email_password"	(
			"user_id",
			"password_hash"	
		)
		VALUES ($1, $2)
	`
	_, err := queryMethod(
		query,
		auth.UserId,
		auth.PasswordHash,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
