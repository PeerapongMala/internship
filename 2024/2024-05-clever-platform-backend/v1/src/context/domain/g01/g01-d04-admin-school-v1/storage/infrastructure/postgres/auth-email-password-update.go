package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthEmailPasswordUpdate(tx *sqlx.Tx, auth *constant.AuthEmailPasswordEntity) error {
	var QueryMethod func(query string, args ...any) (sql.Result, error)
	if tx != nil {
		QueryMethod = tx.Exec
	} else {
		QueryMethod = postgresRepository.Database.Exec
	}
	query := `
		INSERT INTO "auth"."auth_email_password" ("user_id", "password_hash")
		VALUES ($2, $1)
		ON CONFLICT ("user_id")
		DO UPDATE SET "password_hash" = EXCLUDED."password_hash";
	`
	_, err := QueryMethod(
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
