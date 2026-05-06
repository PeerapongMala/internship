package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionGroupChoiceCaseDeleteByQuestionId(tx *sqlx.Tx, questionIds ...int) ([]string, error) {
	if len(questionIds) == 0 {
		return nil, nil
	}
	query := `
		WITH deleted_rows AS (
			DELETE FROM "question"."question_group_choice"
			WHERE "question_group_id" = ANY($1)
			RETURNING "image_url"
		)
		SELECT "image_url"
		FROM deleted_rows
		WHERE "image_url" IS NOT NULL;
	`
	imageKeys := []string{}
	err := tx.Select(&imageKeys, query, questionIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return imageKeys, nil
}
