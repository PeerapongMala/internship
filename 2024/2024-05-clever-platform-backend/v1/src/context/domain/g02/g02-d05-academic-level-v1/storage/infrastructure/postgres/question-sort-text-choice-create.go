package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionSortTextChoiceCreate(tx *sqlx.Tx, questionSortTextChoice *constant.QuestionSortTextChoiceEntity) (*constant.QuestionSortTextChoiceEntity, error) {
	query := `
		INSERT INTO "question"."question_sort_text_choice" (
			"question_sort_id",
			"question_text_id",
			"index",
			"is_correct"	
		)	
		VALUES ($1, $2, $3, $4)
		RETURNING *
	`
	questionSortTextChoiceEntity := constant.QuestionSortTextChoiceEntity{}
	err := tx.QueryRowx(
		query,
		questionSortTextChoice.QuestionSortId,
		questionSortTextChoice.QuestionTextId,
		questionSortTextChoice.Index,
		questionSortTextChoice.IsCorrect,
	).StructScan(&questionSortTextChoiceEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionSortTextChoiceEntity, nil
}
