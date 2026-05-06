package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionInputAnswerCreate(tx *sqlx.Tx, questionInputAnswer *constant.QuestionInputAnswerEntity) (*constant.QuestionInputAnswerEntity, error) {
	query := `
		INSERT INTO "question"."question_input_answer" (
			"question_text_description_id",
			"answer_index",
			"type"
		)
		VALUES ($1, $2, $3)
		RETURNING *
	`
	questionInputAnswerEntity := constant.QuestionInputAnswerEntity{}
	err := tx.QueryRowx(
		query,
		questionInputAnswer.QuestionTextDescriptionId,
		questionInputAnswer.AnswerIndex,
		questionInputAnswer.Type,
	).StructScan(&questionInputAnswerEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionInputAnswerEntity, nil
}
