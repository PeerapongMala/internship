package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ObserverAccessCaseUpdateSchool(tx *sqlx.Tx, observerAccessId *int, schoolIds []int) ([]int, error) {
	query := `
		DELETE FROM "auth"."observer_access_school"
		WHERE
			"observer_access_id" = $1
`
	_, err := tx.Exec(query, observerAccessId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query = `
		INSERT INTO "auth"."observer_access_school" (
			"observer_access_id",	                                             
		    "school_id"
		)
		VALUES ($1, $2)
`
	for _, schoolId := range schoolIds {
		_, err := tx.Exec(query, observerAccessId, schoolId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return schoolIds, nil
}
