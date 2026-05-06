package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionGroupCreate(tx *sqlx.Tx, questionGroup *constant.QuestionGroupEntity) (*constant.QuestionGroupEntity, error) {
	query := `
		INSERT INTO "question"."question_group" (
			"question_id",
			"use_sound_description_only",
			"choice_type",
			"can_reuse_choice",
			"group_amount",
			"choice_amount",
			"dummy_amount"	
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING *
	`
	questionGroupEntity := constant.QuestionGroupEntity{}
	err := tx.QueryRowx(
		query,
		questionGroup.QuestionId,
		questionGroup.UseSoundDescriptionOnly,
		questionGroup.ChoiceType,
		questionGroup.CanReuseChoice,
		questionGroup.GroupAmount,
		questionGroup.ChoiceAmount,
		questionGroup.DummyAmount,
	).StructScan(&questionGroupEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionGroupEntity, nil
}
