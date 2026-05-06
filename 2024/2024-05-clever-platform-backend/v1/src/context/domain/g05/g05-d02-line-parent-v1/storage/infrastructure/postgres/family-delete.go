package postgres

import (
	"database/sql"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) DeleteFamily(tx *sqlx.Tx, familyID int) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()

	agrs := []interface{}{familyID}

	// Delete member
	query := `
		DELETE FROM "family"."family_member" fm
		WHERE fm.family_id = $1
	`

	_, err := queryMethod(query, agrs...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	// Delete family
	query = `
		DELETE FROM "family"."family" f
		WHERE f.id = $1
	`

	_, err = queryMethod(query, agrs...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
