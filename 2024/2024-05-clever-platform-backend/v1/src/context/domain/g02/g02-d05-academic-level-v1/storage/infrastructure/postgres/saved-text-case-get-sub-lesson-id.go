package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SavedTextCaseGetSubLessonId(tx *sqlx.Tx, savedTextGroupId string) ([]int, error) {
	var queryMethod func(dest interface{}, query string, args ...interface{}) error
	if tx == nil {
		queryMethod = postgresRepository.Database.Select
	} else {
		queryMethod = tx.Select
	}

	query := `
		SELECT
			DISTINCT "sl"."id"
		FROM "curriculum_group"."saved_text" st
		INNER JOIN "question"."question_text" qt ON "st"."group_id" = "qt"."saved_text_group_id"
		INNER JOIN "question"."question" q ON "qt"."question_id" = "q"."id"
		INNER JOIN "level"."level" l ON "q"."level_id" = "l"."id"
		INNER JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
		WHERE "st"."group_id" = $1
	`
	subLessonIds := []int{}
	err := queryMethod(&subLessonIds, query, savedTextGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subLessonIds, nil
}
