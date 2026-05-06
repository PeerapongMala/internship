package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubLessonCaseGetStandard(subLessonId int) (*constant.SubLessonStandardEntity, error) {
	query := `
		SELECT
			"c"."name" AS "criteria_name",
			"c"."short_name" AS "criteria_short_name",
			"lc"."name" AS "learning_content_name",
			"i"."name" AS "indicator_name",
			"i"."short_name" AS "indicator_short_name"
		FROM
			"subject"."sub_lesson" sl
		LEFT JOIN "curriculum_group"."indicator" i
			ON "sl"."indicator_id" = "i"."id"
		LEFT JOIN "curriculum_group"."learning_content" lc
			ON "i"."learning_content_id" = "lc"."id"
		LEFT JOIN "curriculum_group"."criteria" c
			ON "lc"."criteria_id" = "c"."id"
		WHERE
			"sl"."id" = $1
	`
	subLessonStandardEntity := constant.SubLessonStandardEntity{}
	err := postgresRepository.Database.QueryRowx(query, subLessonId).StructScan(&subLessonStandardEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subLessonStandardEntity, nil
}
