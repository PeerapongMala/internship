package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubLessonCaseListByLesson(lessonId int) ([]constant.SubLessonDataEntity, error) {
	query := `
		SELECT
			"sl"."id",
			"sl"."index",
			"sl"."name"
		FROM "subject"."sub_lesson" sl
		WHERE
			"sl"."lesson_id" = $1
	`
	subLessonDataEntities := []constant.SubLessonDataEntity{}
	err := postgresRepository.Database.Select(&subLessonDataEntities, query, lessonId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subLessonDataEntities, nil
}
