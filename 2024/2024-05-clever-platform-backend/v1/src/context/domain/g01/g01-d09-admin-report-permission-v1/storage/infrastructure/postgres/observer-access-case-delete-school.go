package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ObserverAccessCaseDeleteSchool(tx *sqlx.Tx, observerAccessId int, schoolIds []int) error {
	query := `
		DELETE FROM "auth"."observer_access_school"
		WHERE
			"observer_access_id" = $1
			AND
			"school_id" = $2
`
	for _, schoolId := range schoolIds {
		_, err := tx.Exec(query, observerAccessId, schoolId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
