package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolAffiliationList(filter *constant2.SchoolAffiliationFilter, pagination *helper.Pagination) ([]constant2.SchoolAffiliationEntity, error) {
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
			"u"."first_name" as "updated_by"
		FROM "school_affiliation"."school_affiliation" sa
		LEFT JOIN "user"."user" u
			ON "sa"."updated_by" = "u"."id"
		WHERE
			("school_affiliation_group" = $1 OR "school_affiliation_group" = $2)
	`
	args := []interface{}{constant.Opec, constant.Others}
	argsIndex := 3

	if filter.Type != "" {
		query += fmt.Sprintf(` AND "type" = $%d`, argsIndex)
		args = append(args, filter.Type)
		argsIndex++
	}
	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND "name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.SearchText+"%")
		argsIndex++
	}
	if filter.SchoolAffiliationGroup != "" {
		query += fmt.Sprintf(` AND "school_affiliation_group" = $%d`, argsIndex)
		args = append(args, filter.SchoolAffiliationGroup)
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "sa"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}

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
	}

	query += fmt.Sprintf(` ORDER BY "sa"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
	args = append(args, pagination.Offset, pagination.Limit)

	schoolAffiliationEntities := []constant2.SchoolAffiliationEntity{}
	err := postgresRepository.Database.Select(&schoolAffiliationEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return schoolAffiliationEntities, nil
}
