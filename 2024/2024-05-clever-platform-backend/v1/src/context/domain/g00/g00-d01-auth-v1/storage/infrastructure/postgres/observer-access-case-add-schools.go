package postgres

import (
	"database/sql"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ObserverAccessCaseAddSchool(tx *sqlx.Tx, observerAccessId int, schools []int) ([]int, error) {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()
	query := `
		INSERT INTO "auth"."observer_access_school" (
			"observer_access_id",
			"school_id"	
		)
		VALUES ($1, $2)
	`
	for _, school := range schools {
		_, err := queryMethod(
			query,
			observerAccessId,
			school,
		)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return schools, nil
}
