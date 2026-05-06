package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionSortCreate(tx *sqlx.Tx, questionSort *constant.QuestionSortEntity) (*constant.QuestionSortEntity, error) {
	query := `
		INSERT INTO "question"."question_sort" (
			"question_id",	
			"use_sound_description_only",
			"choice_type",
			"choice_amount",
			"can_reuse_choice",
			"dummy_amount"
		)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING *
	`
	questionSortEntity := constant.QuestionSortEntity{}
	err := tx.QueryRowx(
		query,
		questionSort.QuestionId,
		questionSort.UseSoundDescriptionOnly,
		questionSort.ChoiceType,
		questionSort.ChoiceAmount,
		questionSort.CanReuseChoice,
		questionSort.DummyAmount,
	).StructScan(&questionSortEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionSortEntity, nil
}
