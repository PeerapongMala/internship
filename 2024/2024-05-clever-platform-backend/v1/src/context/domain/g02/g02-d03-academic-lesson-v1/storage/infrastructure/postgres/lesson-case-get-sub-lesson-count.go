package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LessonCaseGetSubLesson(subjectId int) ([]constant.SubjectMetaLessonEntity, error) {
	query := `
		SELECT
		    "ls"."id" AS "lesson_id",
			COALESCE(COUNT(DISTINCT "sl"."id"), 0) AS "sub_lesson_count"
		FROM "subject"."subject" s
		INNER JOIN "subject"."lesson" ls ON "s"."id" = "ls"."subject_id" AND "ls"."status" = 'enabled'
		INNER JOIN "subject"."sub_lesson" sl ON "ls"."id" = "sl"."lesson_id" AND "sl"."status" = 'enabled'
		WHERE
		    "s"."id" = $1
		GROUP BY "ls"."id"
	`

	lessons := []constant.SubjectMetaLessonEntity{}
	err := postgresRepository.Database.Select(&lessons, query, subjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return lessons, nil
}
