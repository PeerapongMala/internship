package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionInputGet(questionId int) (*constant.QuestionInputEntity, error) {
	query := `
		SELECT
			*
		FROM "question"."question_input"
		WHERE
			"question_id" = $1	
	`
	questionInputEntity := constant.QuestionInputEntity{}
	err := postgresRepository.Database.QueryRowx(query, questionId).StructScan(&questionInputEntity)
	if err != nil && err != sql.ErrNoRows {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionInputEntity, nil
}
