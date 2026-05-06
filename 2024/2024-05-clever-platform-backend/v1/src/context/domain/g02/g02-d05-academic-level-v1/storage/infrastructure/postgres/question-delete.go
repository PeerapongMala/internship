package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionDelete(tx *sqlx.Tx, questionIds ...int) error {
	if len(questionIds) == 0 {
		return nil
	}
	query := `
		DELETE FROM "question"."question"
		WHERE
			"id" = ANY($1)	
	`
	_, err := tx.Exec(query, questionIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
