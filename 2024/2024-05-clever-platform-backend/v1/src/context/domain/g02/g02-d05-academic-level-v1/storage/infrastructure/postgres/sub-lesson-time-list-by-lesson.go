package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubLessonTimeListByLesson(lessonId int) ([]constant.SubLessonTime, error) {
	query := `
		SELECT
			"sl"."id" AS "sub_lesson_id",
			"slfs"."is_updated",
			"slfs"."updated_at"	
		FROM "subject"."sub_lesson" sl
		LEFT JOIN "subject"."sub_lesson_file_status" slfs ON "sl"."id" = "slfs"."sub_lesson_id"
		WHERE
		    "sl"."lesson_id" = $1
			AND "sl"."status" = $2
	`
	subLessonIds := []constant.SubLessonTime{}
	err := postgresRepository.Database.Select(&subLessonIds, query, lessonId, "enabled")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subLessonIds, nil
}
