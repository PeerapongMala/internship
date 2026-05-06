package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionGroupGroupMemberCaseDeleteByQuestionGroupChoiceId(tx *sqlx.Tx, questionGroupChoiceId int) error {
	query := `
		DELETE FROM "question"."question_group_group_member"
		WHERE
			"question_group_choice_id" = $1	
	`
	_, err := tx.Exec(query, questionGroupChoiceId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
