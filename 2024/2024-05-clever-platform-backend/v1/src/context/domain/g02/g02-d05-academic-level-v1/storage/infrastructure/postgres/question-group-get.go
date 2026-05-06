package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionGroupGet(questionGroupId int) (*constant.QuestionGroupEntity, error) {
	query := `
		SELECT
			*
		FROM "question"."question_group"
		WHERE
			"question_id" =  $1	
	`
	questionGroupEntity := constant.QuestionGroupEntity{}
	err := postgresRepository.Database.QueryRowx(query, questionGroupId).StructScan(&questionGroupEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionGroupEntity, nil
}
