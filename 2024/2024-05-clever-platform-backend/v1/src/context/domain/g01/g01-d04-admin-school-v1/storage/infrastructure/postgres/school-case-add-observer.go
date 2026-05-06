package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolCaseAddObserver(tx *sqlx.Tx, schoolId int, observerId string) error {
	query := `
		INSERT INTO "school"."school_observer" (
			"school_id",
			"user_id"
		)
		VALUES ($1, $2)
	`
	_, err := tx.Exec(query, schoolId, observerId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
