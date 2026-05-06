package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) HelperCaseSeedSubjectGroup(tx *sqlx.Tx) error {
	query := `
		INSERT INTO "curriculum_group"."seed_subject_group" (
			"id",
			"name"
		)
		VALUES
			(1, 'คณิตศาสตร์'),
			(2, 'ภาษาอังกฤษ');
	`
	_, err := tx.Exec(query)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
