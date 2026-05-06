package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionPlaceholderAnswerTextCreate(tx *sqlx.Tx, questionPlaceholderAnswerText *constant.QuestionPlaceholderAnswerTextEntity) (*constant.QuestionPlaceholderAnswerTextEntity, error) {
	query := `
		INSERT INTO "question"."question_placeholder_answer_text" (
			"question_placeholder_answer_id",
			"choice_index",
			"index"
		)
		VALUES ($1, $2, $3)
		RETURNING *
	`
	questionPlaceholderAnswerTextEntity := constant.QuestionPlaceholderAnswerTextEntity{}
	err := tx.QueryRowx(
		query,
		questionPlaceholderAnswerText.QuestionPlaceholderAnswerId,
		questionPlaceholderAnswerText.ChoiceIndex,
		questionPlaceholderAnswerText.Index,
	).StructScan(&questionPlaceholderAnswerTextEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionPlaceholderAnswerTextEntity, nil
}
