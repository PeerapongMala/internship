package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubLessonCaseGetMeta(subLessonId int) (*constant.SubLessonMetaEntity, error) {
	query := `
		SELECT
			"sl"."id" AS "sub_lesson_id",
			"sl"."name" AS "sub_lesson_name",
			"ls"."id" AS "lesson_id",
			"ls"."name" AS "lesson_name",
			"s"."id" AS "subject_id",
			"s"."name" AS "subject_name",
			"sg"."id" AS "subject_group_id",
			"ssg"."name" AS "subject_group_name",
			"y"."id" AS "year_id",
			"sy"."short_name" AS "year_name",
			"p"."id" AS "platform_id",
			"sp"."name" AS "platform_name",
			"c"."id" AS "curriculum_group_id",
			"c"."name" AS "curriculum_group_name"
		FROM "subject"."sub_lesson" sl
		INNER JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
		INNER JOIN "subject"."subject" s ON "ls"."subject_id" = "s"."id"
		INNER JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
		INNER JOIN "curriculum_group"."seed_subject_group" ssg ON "sg"."seed_subject_group_id" = "ssg"."id"
		INNER JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
		INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
		INNER JOIN "curriculum_group"."platform" p ON "y"."platform_id" = "p"."id"
		INNER JOIN "platform"."seed_platform" sp ON "p"."seed_platform_id" = "sp"."id"
		INNER JOIN "curriculum_group"."curriculum_group" c ON "p"."curriculum_group_id" = "c"."id"
		WHERE
			"sl"."id" = $1
	`

	data := constant.SubLessonMetaEntity{}
	err := postgresRepository.Database.QueryRowx(query, subLessonId).StructScan(&data)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &data, nil
}
