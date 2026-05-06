package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionGet(questionId int) (*constant.QuestionEntity, error) {
	query := `
		SELECT
			*
		FROM "question"."question"
		WHERE
			"id" = $1	
	`
	questionEntity := constant.QuestionEntity{}
	err := postgresRepository.Database.QueryRowx(query, questionId).StructScan(&questionEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionEntity, nil
}
