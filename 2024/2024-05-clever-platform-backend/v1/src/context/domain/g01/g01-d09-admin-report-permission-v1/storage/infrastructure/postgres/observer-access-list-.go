package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ObserverAccessList(filter *constant.ObserverAccessFilter, pagination *helper.Pagination) ([]constant.ObserverAccessEntity, error) {
	query := `
		SELECT
			"oa"."id",
			"oa"."name",
			"oa"."access_name",
			"oa"."district_zone",
			"oa"."area_office",
			"oa"."district_group",
			"oa"."district",
			"oa"."school_affiliation_id",
			"oa"."status",
			"oa"."created_at",
			"oa"."created_by",
			"oa"."updated_at",
			"u"."first_name" AS "updated_by",
			"sa"."type" AS "school_affiliation_type",
			"sal"."type" AS "lao_type",
			"sa"."name" AS "school_affiliation_name",
			"sa"."school_affiliation_group" AS "school_affiliation_group"
		FROM
			"auth"."observer_access" oa
		LEFT JOIN
			"user"."user" u
			ON "oa"."updated_by" = "u"."id" 
		LEFT JOIN
			"school_affiliation"."school_affiliation" sa
			ON "oa"."school_affiliation_id" = "sa"."id"
		LEFT JOIN
			"school_affiliation"."school_affiliation_lao" sal
			ON "sa"."id" = "sal"."school_affiliation_id"
		WHERE
		   	TRUE 
	`
	args := []interface{}{}
	argsIndex := 1

	if filter.Id != nil && *filter.Id != 0 {
		query += fmt.Sprintf(` AND "oa"."id" = $%d`, argsIndex)
		args = append(args, filter.Id)
		argsIndex++
	}
	if filter.Name != nil {
		query += fmt.Sprintf(` AND "oa"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+*filter.Name+"%")
		argsIndex++
	}
	if filter.Status != nil && *filter.Status != "" {
		query += fmt.Sprintf(` AND "oa"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}
	if filter.AccessName != nil {
		query += fmt.Sprintf(` AND "oa"."access_name" = $%d`, argsIndex)
		args = append(args, filter.AccessName)
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
		query += fmt.Sprintf(` ORDER BY "oa"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	observerAccessEntities := []constant.ObserverAccessEntity{}
	err := postgresRepository.Database.Select(&observerAccessEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return observerAccessEntities, nil
}
