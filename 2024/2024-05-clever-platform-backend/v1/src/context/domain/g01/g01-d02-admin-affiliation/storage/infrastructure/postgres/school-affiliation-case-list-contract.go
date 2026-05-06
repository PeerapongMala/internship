package postgres

import (
	"fmt"
	"log"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolAffiliationCaseListContract(schoolAffiliationId int, filter *constant2.ContractFilter, pagination *helper.Pagination) ([]constant2.ContractWithSchoolCountEntity, error) {
	query := `
		SELECT
			"c"."id",
			"c"."school_affiliation_id",
			"c"."name",
			"c"."start_date",
			"c"."end_date",
			"c"."status",
			"c"."wizard_index",
			"c"."created_at",
			"c"."created_by",
			"c"."updated_at",
			"u"."first_name" AS "updated_by",
			COUNT("cs"."school_id") AS "school_count"
		FROM "school_affiliation"."contract" c
		LEFT JOIN
			"school_affiliation"."contract_school" cs
			ON "c"."id" = "cs"."contract_id"
		LEFT JOIN "user"."user" u
			ON "c"."updated_by" = "u"."id"
		WHERE
			"c"."school_affiliation_id" = $1
	`
	args := []interface{}{schoolAffiliationId}
	argsIndex := 2

	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND "c"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.SearchText+"%")
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "c"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}
	if filter.StartDate != nil {
		query += fmt.Sprintf(` AND "c"."start_date" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if filter.EndDate != nil {
		query += fmt.Sprintf(` AND "c"."end_date" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}
	query += fmt.Sprintf(` GROUP BY "c"."id", "u"."first_name"`)

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "c"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	contractEntities := []constant2.ContractWithSchoolCountEntity{}
	err := postgresRepository.Database.Select(&contractEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return contractEntities, nil
}
