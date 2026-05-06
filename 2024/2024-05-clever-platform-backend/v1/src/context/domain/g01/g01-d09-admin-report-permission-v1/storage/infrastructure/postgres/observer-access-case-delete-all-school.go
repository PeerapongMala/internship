package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ObserverAccessCaseDeleteAllSchool(tx *sqlx.Tx, observerAccessId int) error {
	query := `
		DELETE FROM "auth"."observer_access_school"
		WHERE
			"observer_access_id" = $1
`
	_, err := tx.Exec(query, observerAccessId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
