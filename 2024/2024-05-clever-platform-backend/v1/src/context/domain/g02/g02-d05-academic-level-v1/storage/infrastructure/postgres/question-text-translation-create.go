package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionTextTranslationCreate(tx *sqlx.Tx, questionTextTranslation *constant.QuestionTextTranslationEntity) (*constant.QuestionTextTranslationEntity, error) {
	query := `
		INSERT INTO "question"."question_text_translation" (
			"question_text_id",
			"text",
			"language",
			"speech_url"
		)	
		VALUES ($1, $2, $3, $4)
		RETURNING *
	`
	questionTextTranslationEntity := constant.QuestionTextTranslationEntity{}
	err := tx.QueryRowx(
		query,
		questionTextTranslation.QuestionTextId,
		questionTextTranslation.Text,
		questionTextTranslation.Language,
		questionTextTranslation.SpeechUrl,
	).StructScan(&questionTextTranslationEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionTextTranslationEntity, nil
}
