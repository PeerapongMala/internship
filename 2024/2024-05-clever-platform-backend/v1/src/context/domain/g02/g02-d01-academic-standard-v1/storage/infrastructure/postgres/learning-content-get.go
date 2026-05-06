package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LearningContentGet(learningContentId int) (*constant.LearningContentEntity, error) {
	query := `
		SELECT
			"lc"."id",
			"la"."id" AS "learning_area_id",
			"la"."name" AS "learning_area_name",
			"sy"."short_name" AS "seed_year_name",
			"ct"."id" AS "content_id",
			"ct"."name" AS "content_name",
			"c"."id" AS "criteria_id",
			"c"."name" AS "criteria_name",
			"c"."short_name" AS "criteria_short_name",
			"lc"."name",
			"lc"."status",
			"lc"."created_at",
			"lc"."created_by",
			"lc"."updated_at",
			"u"."first_name" AS "updated_by",
			"lc"."admin_login_as"
		FROM "curriculum_group"."learning_content" lc	
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
			ON "lc"."updated_by" = "u"."id"
		WHERE
			"lc"."id" = $1
	`
	learningContentEntity := constant.LearningContentEntity{}
	err := postgresRepository.Database.QueryRowx(query, learningContentId).StructScan(&learningContentEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &learningContentEntity, nil
}
