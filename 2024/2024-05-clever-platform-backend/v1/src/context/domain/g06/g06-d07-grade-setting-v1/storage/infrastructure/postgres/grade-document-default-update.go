package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GradeDocumentDefaultUpdate(tx *sqlx.Tx, schoolId int, id int) error {
	query := `
		UPDATE "grade"."document_template"
		SET "is_default" = FALSE	
		WHERE school_id = $1 AND id != $2
	`
	_, err := tx.Exec(query, schoolId, id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
