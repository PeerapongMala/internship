package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionMultipleChoiceTextChoiceCaseDeleteAll(tx *sqlx.Tx, questionMultipleChoiceIds ...int) error {
	if len(questionMultipleChoiceIds) == 0 {
		return nil
	}
	query := `
		DELETE FROM "question"."question_multiple_choice_text_choice"
		WHERE
			"question_multiple_choice_id" = ANY($1)
	`
	_, err := tx.Exec(query, questionMultipleChoiceIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
