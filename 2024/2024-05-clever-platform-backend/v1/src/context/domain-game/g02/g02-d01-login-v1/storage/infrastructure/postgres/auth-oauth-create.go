package postgres

import (
	"database/sql"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) AuthOauthCreate(tx *sqlx.Tx, authOauth *constant.AuthOauthEntity) error {
	var QueryMethod func(query string, args ...any) (sql.Result, error)
	if tx != nil {
		QueryMethod = tx.Exec
	} else {
		QueryMethod = postgresRepository.Database.Exec
	}
	query := `
		INSERT INTO "auth"."auth_oauth" (
		    "provider",
			"user_id",
			"subject_id"
		)
		VALUES ($1, $2, $3)
	`

	_, err := QueryMethod(
		query,
		authOauth.Provider,
		authOauth.UserId,
		authOauth.SubjectId,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
