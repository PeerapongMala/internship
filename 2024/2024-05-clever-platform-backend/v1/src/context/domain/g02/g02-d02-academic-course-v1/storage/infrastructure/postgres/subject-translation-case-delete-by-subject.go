package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectTranslationCaseDeleteBySubject(tx *sqlx.Tx, subjectId int) error {
	query := `
		DELETE FROM "subject"."subject_translation"
		WHERE	
			"subject_id" = $1
	`
	_, err := tx.Exec(query, subjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
