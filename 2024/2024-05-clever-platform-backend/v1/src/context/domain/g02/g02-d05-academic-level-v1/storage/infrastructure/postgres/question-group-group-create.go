package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionGroupGroupCreate(tx *sqlx.Tx, questionGroupGroup *constant.QuestionGroupGroupEntity) (*constant.QuestionGroupGroupEntity, error) {
	query := `
		INSERT INTO "question"."question_group_group" (
			"question_group_id",
			"question_text_id",
			"index"	
		)	
		VALUES ($1, $2, $3)
		RETURNING *
	`
	questionGroupGroupEntity := constant.QuestionGroupGroupEntity{}
	err := tx.QueryRowx(
		query,
		questionGroupGroup.QuestionGroupId,
		questionGroupGroup.QuestionTextId,
		questionGroupGroup.Index,
	).StructScan(&questionGroupGroupEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	questionGroupGroupEntity.SavedTextGroupId = questionGroupGroup.SavedTextGroupId

	return &questionGroupGroupEntity, nil
}
