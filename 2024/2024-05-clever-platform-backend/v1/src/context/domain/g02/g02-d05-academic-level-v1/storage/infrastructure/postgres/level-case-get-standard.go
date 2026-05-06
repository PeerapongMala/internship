package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LevelCaseGetStandard(levelId int) (*constant.LevelStandardEntity, error) {
	query := `
		SELECT
			"i"."name" AS "indicator_name",
			"i"."short_name" AS "indicator_short_name",
			"c"."name" AS "criteria_name",
			"c"."short_name" AS "criteria_short_name",
			"la"."name" AS "learning_area_name"
		FROM "level"."level" l
		LEFT JOIN "subject"."sub_lesson" sl
			ON "l"."sub_lesson_id" = "sl"."id"
		LEFT JOIN "curriculum_group"."indicator" i
			ON "sl"."indicator_id" = "i"."id"	
		LEFT JOIN "curriculum_group"."learning_content" lc
			ON "i"."learning_content_id" = "lc"."id"
		LEFT JOIN "curriculum_group"."criteria" c 
			ON "lc"."criteria_id" = "c"."id"
		LEFT JOIN "curriculum_group"."content" ct
			ON "c"."content_id" = "ct"."id"
		LEFT JOIN "curriculum_group"."learning_area" la
			ON "ct"."learning_area_id" = "la"."id"
		WHERE
			"l"."id" = $1
	`
	levelStandardEntity := constant.LevelStandardEntity{}
	err := postgresRepository.Database.QueryRowx(query, levelId).StructScan(&levelStandardEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &levelStandardEntity, nil
}
