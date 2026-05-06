package postgres

import (
	"fmt"
	"log"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolAffiliationDoeList(filter *constant2.SchoolAffiliationDoeFilter, pagination *helper.Pagination) ([]constant2.SchoolAffiliationDoeDataEntity, error) {
	query := `
			SELECT
				"sad".*,
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
			FROM "school_affiliation"."school_affiliation_doe" sad
			LEFT JOIN "school_affiliation"."school_affiliation" sa
				ON "sad"."school_affiliation_id" = "sa"."id" 
			LEFT JOIN "user"."user" u	
				ON "sa"."updated_by" = "u"."id"
			WHERE
				TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if filter.Type != "" {
		query += fmt.Sprintf(` AND "type" ILIKE $%d`, argsIndex)
		args = append(args, filter.Type)
		argsIndex++
	}
	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND "name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.SearchText+"%")
		argsIndex++
	}
	if filter.DistrictZone != "" {
		query += fmt.Sprintf(` AND "district_zone" ILIKE $%d`, argsIndex)
		args = append(args, filter.DistrictZone)
		argsIndex++
	}
	if filter.District != "" {
		query += fmt.Sprintf(` AND "district" ILIKE $%d`, argsIndex)
		args = append(args, filter.District)
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

	schoolAffiliationDoeDataEntities := []constant2.SchoolAffiliationDoeDataEntity{}
	err := postgresRepository.Database.Select(&schoolAffiliationDoeDataEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return schoolAffiliationDoeDataEntities, nil
}
