package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubLessonCaseGetCurriculumGroupId(subLessonId int) (*int, error) {
	query := `
		SELECT
			"y"."curriculum_group_id"
		FROM "subject"."sub_lesson" sl
		LEFT JOIN "subject"."lesson"	l
			ON "sl"."lesson_id" = "l"."id"
		LEFT JOIN "subject"."subject" s
			ON "l"."subject_id" = "s"."id"
		LEFT JOIN "curriculum_group"."subject_group" sg
			ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN "curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		WHERE "sl"."id" = $1
	`
	var curriculumGroupId int
	err := postgresRepository.Database.QueryRowx(
		query,
		subLessonId,
	).Scan(&curriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &curriculumGroupId, nil
}
