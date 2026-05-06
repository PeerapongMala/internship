package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionGroupGroupMemberCaseDeleteByQuestionId(tx *sqlx.Tx, questionIds ...int) error {
	if len(questionIds) == 0 {
		return nil
	}
	query := `
		SELECT
			"id"
		FROM "question"."question_group_choice"
		WHERE
			"question_group_id" = ANY($1)
	`
	questionGroupChoiceIds := []int{}
	err := tx.Select(&questionGroupChoiceIds, query, questionIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	query = `
		DELETE FROM "question"."question_group_group_member"
		WHERE
			"question_group_choice_id" = ANY($1)
	`
	if len(questionGroupChoiceIds) != 0 {
		_, err := tx.Exec(query, questionGroupChoiceIds)
		if err != nil {
			return err
		}
	}
	return nil
}
