package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionPlaceholderTextChoiceCreate(tx *sqlx.Tx, questionPlaceholderTextChoice *constant.QuestionPlaceholderTextChoiceEntity) (*constant.QuestionPlaceholderTextChoiceEntity, error) {
	query := `
		INSERT INTO "question"."question_placeholder_text_choice" (
			"question_placeholder_id",
			"question_text_id",
			"index",
			"is_correct"
		)
		VALUES ($1, $2, $3, $4)	
		RETURNING *
	`
	questionPlaceholderTextChoiceEntity := constant.QuestionPlaceholderTextChoiceEntity{}
	err := tx.QueryRowx(
		query,
		questionPlaceholderTextChoice.QuestionPlaceholderId,
		questionPlaceholderTextChoice.QuestionTextId,
		questionPlaceholderTextChoice.Index,
		questionPlaceholderTextChoice.IsCorrect,
	).StructScan(&questionPlaceholderTextChoiceEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionPlaceholderTextChoiceEntity, nil
}
