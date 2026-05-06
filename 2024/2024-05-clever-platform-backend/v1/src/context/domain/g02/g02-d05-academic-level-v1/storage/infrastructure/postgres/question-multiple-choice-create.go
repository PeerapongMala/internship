package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionMultipleChoiceCreate(tx *sqlx.Tx, questionMultipleChoice *constant.QuestionMultipleChoiceEntity) (*constant.QuestionMultipleChoiceEntity, error) {
	query := `
		INSERT INTO "question"."question_multiple_choice" (
			"question_id",
			"use_sound_description_only",	
			"choice_type",
			"correct_choice_amount",
			"max_point"
		)	
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *
	`
	questionMultipleChoiceEntity := constant.QuestionMultipleChoiceEntity{}
	err := tx.QueryRowx(
		query,
		questionMultipleChoice.QuestionId,
		questionMultipleChoice.UseSoundDescriptionOnly,
		questionMultipleChoice.ChoiceType,
		questionMultipleChoice.CorrectChoiceAmount,
		questionMultipleChoice.MaxPoint,
	).StructScan(&questionMultipleChoiceEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionMultipleChoiceEntity, nil
}
