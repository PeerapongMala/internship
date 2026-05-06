package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionSortAnswerCaseDeleteByQuestionId(tx *sqlx.Tx, questionSortIds ...int) error {
	if len(questionSortIds) == 0 {
		return nil
	}
	query := `
		DELETE FROM "question"."question_sort_answer"	
		WHERE
			"question_sort_id" = ANY($1)
	`
	_, err := tx.Exec(query, questionSortIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
