package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionMultipleChoiceImageChoiceCaseListByQuestion(questionId int) ([]constant.QuestionMultipleChoiceImageChoiceEntity, error) {
	query := `
		SELECT
			*
		FROM "question"."question_multiple_choice_image_choice"
		WHERE
			"question_multiple_choice_id" = $1	
	`
	questionMultipleChoiceImageChoiceEntities := []constant.QuestionMultipleChoiceImageChoiceEntity{}
	err := postgresRepository.Database.Select(&questionMultipleChoiceImageChoiceEntities, query, questionId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return questionMultipleChoiceImageChoiceEntities, nil
}
