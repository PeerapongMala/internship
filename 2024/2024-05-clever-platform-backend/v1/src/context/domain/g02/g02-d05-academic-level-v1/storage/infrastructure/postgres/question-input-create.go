package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionInputCreate(tx *sqlx.Tx, questionInput *constant.QuestionInputEntity) (*constant.QuestionInputEntity, error) {
	query := `
		INSERT INTO "question"."question_input"	(
			"question_id",
			"use_sound_description_only",
			"input_type",
			"hint_type"
		)
		VALUES ($1, $2, $3, $4)
		RETURNING *
	`
	questionInputEntity := constant.QuestionInputEntity{}
	err := tx.QueryRowx(
		query,
		questionInput.QuestionId,
		questionInput.UseSoundDescriptionOnly,
		questionInput.InputType,
		questionInput.HintType,
	).StructScan(&questionInputEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionInputEntity, nil
}
