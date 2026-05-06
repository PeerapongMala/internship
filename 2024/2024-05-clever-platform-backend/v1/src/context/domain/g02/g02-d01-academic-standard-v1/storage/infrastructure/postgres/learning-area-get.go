package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LearningAreaGet(learningAreaId int) (*constant.LearningAreaEntity, error) {
	query := `
		SELECT
			"la"."id",
			"la"."curriculum_group_id",
			"la"."year_id",
			"la"."name",
			"la"."status",
			"la"."created_at",
			"la"."created_by",
			"la"."updated_at",
			"u"."first_name" as "updated_by",
			"la"."admin_login_as",
			"sy"."short_name" as "seed_year_name"
		FROM
			"curriculum_group"."learning_area" la	
		LEFT JOIN "user"."user" u
			ON "la"."updated_by" = "u"."id"
		LEFT JOIN "curriculum_group"."year" y
			ON "la"."year_id" =  "y"."id"
		LEFT JOIN "curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		WHERE
			"la"."id" = $1
	`
	learningAreaEntity := constant.LearningAreaEntity{}
	err := postgresRepository.Database.QueryRowx(query, learningAreaId).StructScan(&learningAreaEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &learningAreaEntity, nil
}
