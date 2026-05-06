package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ObserverAccessCasePatchSchool(tx *sqlx.Tx, observerAccessId *int, schoolIds []int) ([]int, error) {
	query := `
		INSERT INTO "auth"."observer_access_school" (
			"observer_access_id",	                                             
		    "school_id"
		)
		VALUES ($1, $2)
		ON CONFLICT ("observer_access_id", "school_id") DO NOTHING
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
