package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) YearList() ([]constant.YearWithSubjectEntity, error) {
	query := `
		SELECT
			"y"."id",
			"y"."curriculum_group_id",
			"y"."seed_year_id",
			"y"."status",
			"y"."created_at",
			"y"."created_by",
			"y"."updated_at",
			"u"."first_name" AS "updated_by",
			"y"."admin_login_as",
			"sy"."name" AS "seed_year_name",
			"sy"."short_name" AS "seed_year_short_name"
		FROM "curriculum_group"."year" y
		LEFT JOIN "curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		LEFT JOIN "user"."user" u
			ON "y"."updated_by" = "u"."id"
	`

	yearWithSubjectEntities := []constant.YearWithSubjectEntity{}
	err := postgresRepository.Database.Select(&yearWithSubjectEntities, query)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return yearWithSubjectEntities, nil
}
