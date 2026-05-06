package postgres

import (
	"database/sql"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ObserverCaseAddObserverAccess(tx *sqlx.Tx, userId string, observerAccesses []int) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()

	query := `
		INSERT INTO "user"."user_observer_access" (
			"user_id",
			"observer_access_id"
		)
		VALUES ($1, $2)
	`
	for _, access := range observerAccesses {
		_, err := queryMethod(
			query,
			userId,
			access,
		)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
