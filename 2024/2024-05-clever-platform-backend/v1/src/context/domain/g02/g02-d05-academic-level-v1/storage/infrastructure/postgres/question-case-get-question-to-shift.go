package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionCaseGetQuestionToShift(levelId int,
	targetQuestionIndex int) ([]constant.QuestionEntity, error) {
	query := `
		SELECT
			*
		FROM
			"question"."question"
		WHERE
			"level_id" = $1
			AND "index" > $2
	`
	questionEntities := []constant.QuestionEntity{}
	err := postgresRepository.Database.Select(&questionEntities, query, levelId, targetQuestionIndex)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return questionEntities, err
}
