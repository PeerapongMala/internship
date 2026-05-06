package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LessonCaseGetSubLessonCount(lessonId int) (int, error) {
	query := `
		SELECT
			COALESCE(COUNT(DISTINCT "sl"."id"), 0) AS "sub_lesson_count"
		FROM "subject"."lesson" ls
		LEFT JOIN "subject"."sub_lesson" sl ON "ls"."id" = "sl"."lesson_id" AND "sl"."status" = 'enabled'
		WHERE
		    "ls"."id" = $1
	`

	subLessonCount := 0
	err := postgresRepository.Database.QueryRowx(query, lessonId).Scan(&subLessonCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}

	return subLessonCount, nil
}
