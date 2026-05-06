package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionInputAnswerTextCreate(tx *sqlx.Tx, questionInputAnswerText *constant.QuestionInputAnswerTextEntity) (*constant.QuestionInputAnswerTextEntity, error) {
	query := `
		INSERT INTO "question"."question_input_answer_text"	(
			"question_input_answer_id",
			"question_text_id",
			"index"	
		)
		VALUES ($1, $2, $3)
		RETURNING *
	`
	questionInputAnswerTextEntity := constant.QuestionInputAnswerTextEntity{}
	err := tx.QueryRowx(
		query,
		questionInputAnswerText.QuestionInputAnswerId,
		questionInputAnswerText.QuestionTextId,
		questionInputAnswerText.Index,
	).StructScan(&questionInputAnswerTextEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionInputAnswerTextEntity, nil
}
