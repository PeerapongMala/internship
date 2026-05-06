package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionSortAnswerCreate(tx *sqlx.Tx, questionSortAnswer *constant.QuestionSortAnswerEntity) (*constant.QuestionSortAnswerEntity, error) {
	query := `
		INSERT INTO "question"."question_sort_answer"	(
			"question_sort_id",
			"question_sort_text_choice_id",
			"index"
		)
		VALUES ($1, $2, $3)
		RETURNING *
	`
	questionSortAnswerEntity := constant.QuestionSortAnswerEntity{}
	err := tx.QueryRowx(
		query,
		questionSortAnswer.QuestionSortId,
		questionSortAnswer.QuestionSortTextChoiceId,
		questionSortAnswer.Index,
	).StructScan(&questionSortAnswerEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionSortAnswerEntity, nil
}
