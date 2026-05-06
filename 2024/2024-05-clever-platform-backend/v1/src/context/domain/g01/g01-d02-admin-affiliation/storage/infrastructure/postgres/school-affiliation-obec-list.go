package postgres

import (
	"fmt"
	"log"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository postgresRepository) SchoolAffiliationObecList(filter *constant2.SchoolAffiliationObecFilter, pagination *helper.Pagination) ([]constant2.SchoolAffiliationObecDataEntity, error) {
	query := `
		SELECT
			"sao".*,
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
		FROM "school_affiliation"."school_affiliation_obec" sao
		LEFT JOIN "school_affiliation"."school_affiliation" sa
			ON "sao"."school_affiliation_id" = "sa"."id"
		LEFT JOIN "user"."user" u	
				ON "sa"."updated_by" = "u"."id"
		WHERE
			TRUE
	`
	args := []interface{}{}
	argsIndex := 1

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
	if filter.InspectionArea != "" {
		query += fmt.Sprintf(` AND "inspection_area" = $%d`, argsIndex)
		args = append(args, filter.InspectionArea)
		argsIndex++
	}
	if filter.AreaOffice != "" {
		query += fmt.Sprintf(` AND "area_office" = $%d`, argsIndex)
		args = append(args, filter.AreaOffice)
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

	schoolAffiliationObecDataEntities := []constant2.SchoolAffiliationObecDataEntity{}
	err := postgresRepository.Database.Select(&schoolAffiliationObecDataEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return schoolAffiliationObecDataEntities, nil
}
