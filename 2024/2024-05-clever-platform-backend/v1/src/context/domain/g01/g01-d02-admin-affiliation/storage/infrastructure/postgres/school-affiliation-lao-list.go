package postgres

import (
	"fmt"
	"log"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolAffiliationLaoList(filter *constant2.SchoolAffiliationLaoFilter, pagination *helper.Pagination) ([]constant2.SchoolAffiliationLaoDataEntity, error) {
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
			"u"."first_name" as "updated_by",
			"sal"."school_affiliation_id",
			"sal"."type" AS "lao_type",
			"sal"."district",
			"sal"."sub_district",
			"sal"."province"
		FROM "school_affiliation"."school_affiliation_lao" sal
		LEFT JOIN "school_affiliation"."school_affiliation" sa
			ON "sal"."school_affiliation_id" = "sa"."id"
		LEFT JOIN "user"."user" u 
			ON "sa"."updated_by" = "u"."id"
		WHERE
			TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND "name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.SearchText+"%")
		argsIndex++
	}
	if filter.Type != "" {
		query += fmt.Sprintf(` AND "sa"."type" = $%d`, argsIndex)
		args = append(args, filter.Type)
		argsIndex++
	}
	if filter.LaoType != "" {
		query += fmt.Sprintf(` AND "sal"."type" = $%d`, argsIndex)
		args = append(args, filter.LaoType)
		argsIndex++
	}
	if filter.Province != "" {
		query += fmt.Sprintf(` AND "province" = $%d`, argsIndex)
		args = append(args, filter.Province)
		argsIndex++
	}
	if filter.District != "" {
		query += fmt.Sprintf(` AND "district" = $%d`, argsIndex)
		args = append(args, filter.District)
		argsIndex++
	}
	if filter.SubDistrict != "" {
		query += fmt.Sprintf(` AND "sub_district" = $%d`, argsIndex)
		args = append(args, filter.SubDistrict)
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "sa"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT (*) FROM (%s)`, query)
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

	schoolAffiliationLaoDataEntities := []constant2.SchoolAffiliationLaoDataEntity{}
	err := postgresRepository.Database.Select(&schoolAffiliationLaoDataEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return schoolAffiliationLaoDataEntities, nil
}
