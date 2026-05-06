package postgres

import (
	"database/sql"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthCaseAddStudentAuthPin(tx *sqlx.Tx, userId, pin string) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()
	query := `
		INSERT INTO "auth"."auth_pin" (
			"user_id",
			"pin"	
		)	
		VALUES ($1, $2)
	`
	_, err := queryMethod(
		query,
		userId,
		pin,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
