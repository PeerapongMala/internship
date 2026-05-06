package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionPlaceholderCreate(tx *sqlx.Tx, questionPlaceholder *constant.QuestionPlaceholderEntity) (*constant.QuestionPlaceholderEntity, error) {
	query := `
		INSERT INTO "question"."question_placeholder" (
			"question_id",
			"use_sound_description_only",
			"choice_type",
			"choice_amount",
			"can_reuse_choice",
			"dummy_amount",
			"hint_type"	
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING *
	`
	questionPlaceholderEntity := constant.QuestionPlaceholderEntity{}
	err := tx.QueryRowx(
		query,
		questionPlaceholder.QuestionId,
		questionPlaceholder.UseSoundDescriptionOnly,
		questionPlaceholder.ChoiceType,
		questionPlaceholder.ChoiceAmount,
		questionPlaceholder.CanReuseChoice,
		questionPlaceholder.DummyAmount,
		questionPlaceholder.HintType,
	).StructScan(&questionPlaceholderEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionPlaceholderEntity, nil
}
