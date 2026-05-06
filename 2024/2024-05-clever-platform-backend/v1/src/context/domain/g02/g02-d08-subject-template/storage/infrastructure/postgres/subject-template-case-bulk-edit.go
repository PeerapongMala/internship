package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubjectTemplateCaseBulkEdit(tx *sqlx.Tx, m map[string][]int) error {
	query := `
		UPDATE "grade"."subject_template"
		SET "status" = $1
		WHERE "id" = ANY($2)
	`
	for k, v := range m {
		_, err := tx.Exec(query, k, v)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}
	return nil
}
