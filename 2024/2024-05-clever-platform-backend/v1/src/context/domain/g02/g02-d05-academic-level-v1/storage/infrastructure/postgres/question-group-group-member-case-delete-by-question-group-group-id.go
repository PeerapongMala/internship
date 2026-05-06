package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository) QuestionGroupGroupMemberCaseDeleteByQuestionGroupGroupId(tx *sqlx.Tx, questionGroupGroupId int) error {
	query := `
		DELETE FROM "question"."question_group_group_member"
		WHERE
			"question_group_group_id" = $1	
	`
	_, err := tx.Exec(query, questionGroupGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
