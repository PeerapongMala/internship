package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionPlaceholderGet(questionId int) (*constant.QuestionPlaceholderEntity, error) {
	query := `
		SELECT
			*
		FROM "question"."question_placeholder"
		WHERE
			"question_id" = $1	
	`
	questionPlaceholderEntity := constant.QuestionPlaceholderEntity{}
	err := postgresRepository.Database.QueryRowx(query, questionId).StructScan(&questionPlaceholderEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionPlaceholderEntity, nil
}
