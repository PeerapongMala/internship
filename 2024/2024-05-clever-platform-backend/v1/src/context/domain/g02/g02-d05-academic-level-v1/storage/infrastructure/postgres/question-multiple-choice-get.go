package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionMultipleChoiceGet(questionMultipleChoiceId int) (*constant.QuestionMultipleChoiceEntity, error) {
	query := `
		SELECT
			*
		FROM "question"."question_multiple_choice"	
		WHERE
			"question_id" = $1
	`
	questionMultipleChoiceEntity := constant.QuestionMultipleChoiceEntity{}
	err := postgresRepository.Database.QueryRowx(query, questionMultipleChoiceId).StructScan(&questionMultipleChoiceEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionMultipleChoiceEntity, nil
}
