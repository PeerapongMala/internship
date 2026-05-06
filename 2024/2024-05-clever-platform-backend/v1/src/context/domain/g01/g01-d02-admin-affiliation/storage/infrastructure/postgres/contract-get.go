package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ContractGet(contractId int) (*constant.ContractEntity, error) {
	query := `
		SELECT
			"c"."id",
			"c"."seed_platform_id",
			"c"."seed_project_id",
			"sp"."name" AS "seed_platform_name",
			"spj"."name" AS "seed_project_name",
			"c"."school_affiliation_id",
			"c"."name",
			"c"."start_date",
			"c"."end_date",
			"c"."status",
			"c"."wizard_index",
			"c"."created_at",
			"c"."created_by",
			"c"."updated_at",
			"u"."first_name" as "updated_by" 
		FROM "school_affiliation"."contract" c
		LEFT JOIN "user"."user" u	
			ON "c"."updated_by" = "u"."id"
		LEFT JOIN "platform"."seed_platform" sp
			ON "c"."seed_platform_id" = "sp"."id"
		LEFT JOIN "platform"."seed_project" spj
			ON "c"."seed_project_id" = "spj"."id"
		WHERE
			"c"."id" = $1
	`
	contractEntity := constant.ContractEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		contractId,
	).StructScan(&contractEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &contractEntity, nil
}
