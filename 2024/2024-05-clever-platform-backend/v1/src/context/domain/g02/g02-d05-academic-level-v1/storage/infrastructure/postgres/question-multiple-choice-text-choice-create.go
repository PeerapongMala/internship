package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionMultipleChoiceTextChoiceCreate(tx *sqlx.Tx, questionMultipleChoiceTextChoice *constant.QuestionMultipleChoiceTextChoiceEntity) (*constant.QuestionMultipleChoiceTextChoiceEntity, error) {
	query := `
		INSERT INTO "question"."question_multiple_choice_text_choice" (
			"question_multiple_choice_id",
			"question_text_id",
			"index",
			"is_correct",
			"point"
		)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *
	`
	questionMultipleChoiceTextChoiceEntity := constant.QuestionMultipleChoiceTextChoiceEntity{}
	err := tx.QueryRowx(
		query,
		questionMultipleChoiceTextChoice.QuestionMultipleChoiceId,
		questionMultipleChoiceTextChoice.QuestionTextId,
		questionMultipleChoiceTextChoice.Index,
		questionMultipleChoiceTextChoice.IsCorrect,
		questionMultipleChoiceTextChoice.Point,
	).StructScan(&questionMultipleChoiceTextChoiceEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionMultipleChoiceTextChoiceEntity, nil
}
