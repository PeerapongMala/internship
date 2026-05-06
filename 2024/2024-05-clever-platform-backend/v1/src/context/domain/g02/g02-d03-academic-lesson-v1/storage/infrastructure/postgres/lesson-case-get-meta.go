package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LessonCaseGetMeta(lessonIds []int) ([]constant.LessonMetaEntity, error) {
	query := `
		SELECT
		    DISTINCT ON ("s"."id")
		    "s"."id" AS "subject_id",
			"s"."name" AS "subject_name",
			"sg"."id" AS "subject_group_id",
			"ssg"."name" AS "subject_group_name",
			"y"."id" AS "year_id",
			"sy"."name" AS "year_name"
		FROM "subject"."lesson" ls
		INNER JOIN "subject"."subject" s ON "ls"."subject_id" = "s"."id"
		INNER JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
		INNER JOIN "curriculum_group"."seed_subject_group" ssg ON "sg"."seed_subject_group_id" = "ssg"."id"
		INNER JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
		INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
		WHERE
		    "ls"."id" = ANY($1)
	`

	subjects := []constant.LessonMetaEntity{}
	err := postgresRepository.Database.Select(&subjects, query, lessonIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subjects, nil
}
