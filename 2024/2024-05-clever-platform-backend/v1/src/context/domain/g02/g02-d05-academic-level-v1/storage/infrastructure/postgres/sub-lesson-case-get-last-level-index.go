package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubLessonCaseGetLastLevelIndex(subLessonId int) (*int, error) {
	query := `
		SELECT COALESCE(MAX("index"), 0) AS "last_level_index"
		FROM "level"."level" l
		WHERE 
			"l"."sub_lesson_id" = $1
			AND
			"l"."status" != 'disabled'
	`
	var lastLevelIndex int
	err := postgresRepository.Database.QueryRowx(query, subLessonId).Scan(&lastLevelIndex)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &lastLevelIndex, nil
}
