package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubCriteriaTopicGet(subCriteriaTopicId int) (*constant.SubCriteriaTopicEntity, error) {
	query := `
		SELECT
			"sct"."id",
			"sc"."id" AS "sub_criteria_id",
			"sc"."name" AS "sub_criteria_name",
			"i"."id" AS "indicator_id",
			"i"."name" AS "indicator_name", 
			"i"."short_name" AS "indicator_short_name",
			"i"."transcript_name" AS "indicator_transcript_name",
			"lc"."id" AS "learning_content_id",
			"lc"."name" AS "learning_content_name",
			"c"."id" AS "criteria_id",
			"c"."name" AS "criteria_name",
			"c"."short_name" AS "criteria_short_name",
			"ct"."id" AS "content_id",
			"ct"."name" AS "content_name",
			"la"."id" AS "learning_area_id",
			"la"."name" AS "learning_area_name",
			"y"."id" AS "year_id",
			"sy"."short_name" AS "seed_year_name",
			"sct"."name",
			"sct"."short_name",
			"sct"."status",
			"sct"."created_at",
			"sct"."created_by",
			"sct"."updated_at",
			"u"."first_name" AS "updated_by",
			"sct"."admin_login_as"
		FROM
			"curriculum_group"."sub_criteria_topic" sct	
		LEFT JOIN "curriculum_group"."sub_criteria" sc
			ON "sct"."sub_criteria_id" = "sc"."id"
		LEFT JOIN "curriculum_group"."indicator" i
			ON "sct"."indicator_id" = "i"."id"
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
			ON "sct"."updated_by" = "u"."id"
		WHERE
			"sct"."id" = $1
	`
	subCriteriaTopicEntity := constant.SubCriteriaTopicEntity{}
	err := postgresRepository.Database.QueryRowx(query, subCriteriaTopicId).StructScan(&subCriteriaTopicEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subCriteriaTopicEntity, nil
}
