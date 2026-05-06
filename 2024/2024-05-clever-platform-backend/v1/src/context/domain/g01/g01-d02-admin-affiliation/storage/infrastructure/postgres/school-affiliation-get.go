package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolAffiliationGet(schoolAffiliationId int) (*constant.SchoolAffiliationEntity, error) {
	query := `
		SELECT
			"sa"."id",
			"sa"."school_affiliation_group",
			"sa"."type",
			"sa"."name",
			"sa"."short_name",
			"sa"."status",
			"sa"."created_at",
			"sa"."created_by",
			"sa"."updated_at",
			"u"."first_name" AS "updated_by"
		FROM
			"school_affiliation"."school_affiliation" sa
		LEFT JOIN 
			"user"."user" u
			ON "sa"."updated_by" = "u"."id"
		WHERE
			"sa"."id" = $1	
	`
	schoolAffiliationEntity := constant.SchoolAffiliationEntity{}
	err := postgresRepository.Database.QueryRowx(query, schoolAffiliationId).StructScan(&schoolAffiliationEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &schoolAffiliationEntity, nil
}
