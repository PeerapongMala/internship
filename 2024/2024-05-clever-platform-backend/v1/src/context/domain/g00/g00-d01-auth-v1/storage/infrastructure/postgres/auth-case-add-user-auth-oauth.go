package postgres

import (
	"database/sql"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthCaseAddUserAuthOAuth(tx *sqlx.Tx, auth *constant.AuthOAuthEntity) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()
	query := `
		INSERT INTO "auth"."auth_oauth" (
			"provider",
			"user_id",
			"subject_id"	
		)	
		VALUES ($1, $2, $3)
	`
	_, err := queryMethod(
		query,
		auth.Provider,
		auth.UserId,
		auth.SubjectId,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
