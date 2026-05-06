package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubLessonCaseGetSubjectMeta(subLessonId int) (*constant.SubjectMetaEntity, error) {
	query := `
		SELECT
			COUNT(DISTINCT "ls"."id") AS "lesson_count",
			COUNT(DISTINCT "sl"."id") AS "sub_lesson_count"
		FROM "subject"."sub_lesson" sls
		INNER JOIN "subject"."lesson" lss ON "sls"."lesson_id" = "lss"."id"
		INNER JOIN "subject"."subject" s ON "lss"."subject_id" = "s"."id"
		INNER JOIN "subject"."lesson" ls ON "s"."id" = "ls"."subject_id" AND "ls"."status" = 'enabled'
		LEFT JOIN "subject"."sub_lesson" sl ON "ls"."id" = "sl"."lesson_id" AND "sl"."status" = 'enabled'
		WHERE
		    "sls"."id" = $1
		GROUP BY "s"."id"
	`

	meta := constant.SubjectMetaEntity{}
	err := postgresRepository.Database.QueryRowx(query, subLessonId).Scan(&meta.LessonCount, &meta.SubLessonCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &meta, nil
}
