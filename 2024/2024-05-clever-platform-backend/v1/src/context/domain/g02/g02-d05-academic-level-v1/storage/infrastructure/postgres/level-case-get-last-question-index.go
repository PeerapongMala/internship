package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LevelCaseGetLastQuestionIndex(levelId int) (*int, error) {
	query := `
			SELECT COALESCE(MAX("index"), 0) AS "last_question_index"
			FROM "question"."question" q
			WHERE
				"q"."level_id" = $1
	`
	var lastQuestionIndex int
	err := postgresRepository.Database.QueryRowx(query, levelId).Scan(&lastQuestionIndex)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &lastQuestionIndex, nil
}
