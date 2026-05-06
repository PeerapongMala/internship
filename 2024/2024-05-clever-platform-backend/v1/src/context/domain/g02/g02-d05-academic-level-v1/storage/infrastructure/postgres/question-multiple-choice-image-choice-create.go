package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionMultipleChoiceImageChoiceCreate(tx *sqlx.Tx, questionMultipleChoiceImageChoice *constant.QuestionMultipleChoiceImageChoiceEntity) (*constant.QuestionMultipleChoiceImageChoiceEntity, error) {
	query := `
		INSERT INTO "question"."question_multiple_choice_image_choice" (
			"question_multiple_choice_id",
			"index",
			"image_url",
			"is_correct",
			"point"
		)	
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *
	`
	questionMultipleChoiceImageChoiceEntity := constant.QuestionMultipleChoiceImageChoiceEntity{}
	err := tx.QueryRowx(
		query,
		questionMultipleChoiceImageChoice.QuestionMultipleChoiceId,
		questionMultipleChoiceImageChoice.Index,
		questionMultipleChoiceImageChoice.ImageUrl,
		questionMultipleChoiceImageChoice.IsCorrect,
		questionMultipleChoiceImageChoice.Point,
	).StructScan(&questionMultipleChoiceImageChoiceEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionMultipleChoiceImageChoiceEntity, nil
}
