package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionGroupGroupMemberCreate(tx *sqlx.Tx, questionGroupGroupMember *constant.QuestionGroupGroupMemberEntity) (*constant.QuestionGroupGroupMemberEntity, error) {
	query := `
		INSERT INTO "question"."question_group_group_member" (
			"question_group_group_id",
			"question_group_choice_id"
		)	
		VALUES ($1, $2)
		ON CONFLICT ("question_group_group_id", "question_group_choice_id")	DO NOTHING
	`
	questionGroupGroupMemberEntity := constant.QuestionGroupGroupMemberEntity{}
	_, err := tx.Exec(
		query,
		questionGroupGroupMember.QuestionGroupGroupId,
		questionGroupGroupMember.QuestionGroupChoiceId,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionGroupGroupMemberEntity, nil
}
