package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SeedYearGet(seedYearId int) (*constant.SeedYearEntity, error) {
	query := `
		SELECT
		    "sy"."id",
			"sy"."name",
			"sy"."short_name",
			"sy"."status",
			"sy"."created_at",
			"sy"."created_by",
			"sy"."updated_at",
			"u"."first_name" AS "updated_by"
		FROM
			"curriculum_group"."seed_year" sy
		LEFT JOIN 
			"user"."user" u
			ON "sy"."updated_by" = "u"."id"
		WHERE
			"sy"."id" = $1
`
	seedYearEntity := constant.SeedYearEntity{}
	err := postgresRepository.Database.QueryRowx(query, seedYearId).StructScan(&seedYearEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &seedYearEntity, nil
}
