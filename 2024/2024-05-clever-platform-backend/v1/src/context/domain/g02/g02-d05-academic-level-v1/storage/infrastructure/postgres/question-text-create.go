package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionTextCreate(tx *sqlx.Tx, questionText *constant.QuestionTextEntity) (*constant.QuestionTextEntity, error) {
	query := `
		INSERT INTO "question"."question_text" (
			"question_id",
			"saved_text_group_id",
			"type",
			"index"	
		)	
		VALUES ($1, $2, $3, $4)
		RETURNING *
	`
	questionTextEntity := constant.QuestionTextEntity{}
	err := tx.QueryRowx(
		query,
		questionText.QuestionId,
		questionText.SavedTextGroupId,
		questionText.Type,
		questionText.Index,
	).StructScan(&questionTextEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionTextEntity, nil
}
