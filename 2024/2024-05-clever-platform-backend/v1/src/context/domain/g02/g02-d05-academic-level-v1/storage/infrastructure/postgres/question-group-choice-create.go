package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionGroupChoiceCreate(tx *sqlx.Tx, questionGroupChoice *constant.QuestionGroupChoiceEntity) (*constant.QuestionGroupChoiceEntity, error) {
	query := `
		INSERT INTO "question"."question_group_choice" (
			"question_group_id",
			"index",
			"image_url",
			"question_text_id",
			"is_correct"	
		)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *
	`
	questionGroupChoiceEntity := constant.QuestionGroupChoiceEntity{}
	err := tx.QueryRowx(
		query,
		questionGroupChoice.QuestionGroupId,
		questionGroupChoice.Index,
		questionGroupChoice.ImageUrl,
		questionGroupChoice.QuestionTextId,
		questionGroupChoice.IsCorrect,
	).StructScan(&questionGroupChoiceEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionGroupChoiceEntity, nil
}
