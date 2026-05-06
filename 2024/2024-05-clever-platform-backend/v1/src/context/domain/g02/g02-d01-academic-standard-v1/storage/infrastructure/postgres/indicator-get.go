package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) IndicatorGet(indicatorId int) (*constant.IndicatorEntity, error) {
	query := `
		SELECT
			"i"."id",
			"y"."id" AS "year_id",
			"la"."id" AS "learning_area_id",
			"la"."name" AS "learning_area_name",
			"sy"."name" AS "seed_year_name",
			"sy"."short_name" AS "seed_year_short_name",
			"ct"."id" AS "content_id",	
			"ct"."name" AS "content_name",
			"c"."id" AS "criteria_id",
			"c"."name" AS "criteria_name",
			"c"."short_name" AS "criteria_short_name",
			"lc"."id" AS "learning_content_id",
			"lc"."name" AS "learning_content_name",
			"i"."name",
			"i"."short_name",
			"i"."transcript_name",
			"i"."status",
			"i"."created_at",
			"i"."created_by",
			"i"."updated_at",
			"u"."first_name" AS "updated_by",
			"i"."admin_login_as"
		FROM "curriculum_group"."indicator" i	
		LEFT JOIN "curriculum_group"."learning_content" lc
			ON "i"."learning_content_id" = "lc"."id"
		LEFT JOIN "curriculum_group"."criteria" c
			ON "lc"."criteria_id" = "c"."id"
		LEFT JOIN "curriculum_group"."content" ct
			ON "c"."content_id" = "ct"."id"
		LEFT JOIN "curriculum_group"."learning_area" la
			ON "ct"."learning_area_id" = "la"."id"
		LEFT JOIN "curriculum_group"."year" y
			ON "la"."year_id" = "y"."id"
		LEFT JOIN "curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		LEFT JOIN "user"."user" u
			ON "i"."updated_by" = "u"."id"
		WHERE
			"i"."id" = $1
	`
	indicatorEntity := constant.IndicatorEntity{}
	err := postgresRepository.Database.QueryRowx(query, indicatorId).StructScan(&indicatorEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &indicatorEntity, nil
}
