package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionPlaceholderAnswerCreate(tx *sqlx.Tx, questionPlaceholderAnswer *constant.QuestionPlaceholderAnswerEntity) (*constant.QuestionPlaceholderAnswerEntity, error) {
	query := `
		INSERT INTO "question"."question_placeholder_answer" (
			"question_text_description_id",
			"answer_index"
		)
		VALUES ($1, $2)
		RETURNING *
	`
	questionPlaceholderAnswerEntity := constant.QuestionPlaceholderAnswerEntity{}
	err := tx.QueryRowx(
		query,
		questionPlaceholderAnswer.QuestionTextDescriptionId,
		questionPlaceholderAnswer.AnswerIndex,
	).StructScan(&questionPlaceholderAnswerEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionPlaceholderAnswerEntity, nil
}
