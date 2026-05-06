package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) CriteriaGet(criteriaId int) (*constant.CriteriaEntity, error) {
	query := `
		SELECT
			"c"."id",
			"ct"."id" AS "content_id",
			"ct"."name" AS "content_name",
			"la"."id" AS "learning_area_id",
			"la"."name" AS "learning_area_name",
			"sy"."short_name" AS "seed_year_name",
			"c"."name",
			"c"."short_name",
			"c"."status",
			"c"."created_at",
			"c"."created_by",
			"c"."updated_at",
			"u"."first_name" AS "updated_by",
			"c"."admin_login_as"
		FROM
			"curriculum_group"."criteria" c	
		LEFT JOIN "curriculum_group"."content" ct
			ON "c"."content_id" = "ct"."id"
		LEFT JOIN "curriculum_group"."learning_area" la
			ON "ct"."learning_area_id" = "la"."id"
		LEFT JOIN "user"."user" u
			ON "c"."updated_by" = "u"."id"
		LEFT JOIN "curriculum_group"."year" y
			ON "la"."year_id" = "y"."id"
		LEFT JOIN "curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		WHERE
			"c"."id" = $1
	`
	criteriaEntity := constant.CriteriaEntity{}
	err := postgresRepository.Database.QueryRowx(query, criteriaId).StructScan(&criteriaEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &criteriaEntity, nil
}
