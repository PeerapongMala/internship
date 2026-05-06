package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LevelDataGet(levelId int) (*constant.LevelDataEntity, error) {
	query := `
		SELECT
			"l"."index",
			"c"."name" AS "curriculum_group",
			"sp"."name" AS "platform",
			"sy"."short_name" AS "year",
			"ssg"."name" AS "subject_group",
			"s"."name" AS "subject",
			"ls"."name" AS "lesson",
			"sl"."name" AS "sub_lesson"
		FROM
		    "level"."level" l
		LEFT JOIN
		    "subject"."sub_lesson" sl
			ON "l"."sub_lesson_id" = "sl"."id"
		LEFT JOIN
		    "subject"."lesson" ls
			ON "sl"."lesson_id" = "ls"."id"
		LEFT JOIN
		    "subject"."subject" s
			ON "ls"."subject_id" = "s"."id"
		LEFT JOIN
		    "curriculum_group"."subject_group" sg
			ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN
		    "curriculum_group"."seed_subject_group" ssg
		    ON "sg"."seed_subject_group_id" = "ssg"."id"
		LEFT JOIN
		    "curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		LEFT JOIN
		    "curriculum_group"."seed_year" sy
		    ON "y"."seed_year_id" = "sy"."id"
		LEFT JOIN
		    "curriculum_group"."platform" p
		    ON "y"."platform_id" = "p"."id"
		LEFT JOIN
		    "platform"."seed_platform" sp
		    ON "p"."seed_platform_id" = "sp"."id"
		LEFT JOIN
		    "curriculum_group"."curriculum_group" c
			ON "p"."curriculum_group_id" = "c"."id"
		WHERE
		    "l"."id" = $1
	`

	levelDataEntity := constant.LevelDataEntity{}
	err := postgresRepository.Database.QueryRowx(query, levelId).StructScan(&levelDataEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &levelDataEntity, err
}
