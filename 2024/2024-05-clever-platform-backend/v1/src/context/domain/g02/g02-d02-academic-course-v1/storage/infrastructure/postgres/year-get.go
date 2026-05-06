package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) YearGet(yearId int) (*constant.YearEntity, error) {
	query := `
		SELECT
			"y"."id",
			"y"."platform_id",
			"y"."curriculum_group_id",
			"y"."seed_year_id",
			"sy"."short_name" as "seed_year_name",
			"y"."status",
			"y"."created_at",
			"y"."created_by",
			"y"."updated_at",
			"u"."first_name" as "updated_by",
			"y"."admin_login_as"
		FROM "curriculum_group"."year" y
		LEFT JOIN "user"."user" u
			ON "y"."updated_by" = "u"."id"
		LEFT JOIN "curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		WHERE
			"y"."id" = $1
	`
	yearEntity := constant.YearEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		yearId,
	).StructScan(&yearEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &yearEntity, nil
}
