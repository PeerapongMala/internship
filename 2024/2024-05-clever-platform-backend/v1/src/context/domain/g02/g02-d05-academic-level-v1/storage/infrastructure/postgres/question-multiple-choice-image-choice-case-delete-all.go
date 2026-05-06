package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionMultipleChoiceImageChoiceCaseDeleteAll(tx *sqlx.Tx, questionMultipleChoiceIds ...int) ([]string, error) {
	if len(questionMultipleChoiceIds) == 0 {
		return nil, nil
	}
	query := `
		DELETE FROM "question"."question_multiple_choice_image_choice"	
		WHERE
			"question_multiple_choice_id" = ANY($1)
		RETURNING "image_url"
	`
	imageKeys := []string{}
	err := tx.Select(&imageKeys, query, questionMultipleChoiceIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return imageKeys, nil
}
