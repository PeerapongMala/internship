package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubLessonIdListByLesson(lessonId int) ([]int, error) {
	query := `
		SELECT
			"id"
		FROM "subject"."sub_lesson" sl
		WHERE
		    "sl"."lesson_id" = $1
			AND "sl"."status" = $2
	`
	subLessonIds := []int{}
	err := postgresRepository.Database.Select(&subLessonIds, query, lessonId, "enabled")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subLessonIds, nil
}
