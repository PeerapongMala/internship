package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) TemplateSubjectUpdate(tx *sqlx.Tx, id int, cleverSubjectTemplateId *int) error {
	query := `
		UPDATE "grade"."template_subject"
		SET "clever_subject_template_id" = $1
		WHERE "id" = $2
	`
	_, err := tx.Exec(query, cleverSubjectTemplateId, id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
