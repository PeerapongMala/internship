package postgres

import (
	"database/sql"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ObserverCaseUpdateObserverAccesses(tx *sqlx.Tx, userId string, observerAccesses []int) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()

	query := `
		DELETE FROM "user"."user_observer_access"
		WHERE
			"user_id" = $1;
	`
	_, err := queryMethod(query, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	query = `
		INSERT INTO "user"."user_observer_access" (
			"observer_access_id",
			"user_id"	
		)
		VALUES ($1, $2)
	`
	for _, observerAccess := range observerAccesses {
		_, err := queryMethod(query, observerAccess, userId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
