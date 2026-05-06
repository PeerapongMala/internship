package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionLearnGet(questionId int) (*constant.QuestionLearnEntity, error) {
	query := `
		SELECT
			"question_id",
			"text",
			"url"
		FROM "question"."question_learn"
		WHERE
			"question_id" = $1	
	`
	questionLearnEntity := constant.QuestionLearnEntity{}
	err := postgresRepository.Database.QueryRowx(query, questionId).StructScan(&questionLearnEntity)
	if err != nil && err != sql.ErrNoRows {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionLearnEntity, nil
}
