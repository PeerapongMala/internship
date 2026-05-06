package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SchoolList(filter *constant.SchoolFilter, pagination *helper.Pagination) ([]constant.SchoolEntity, error) {
	query := `
		SELECT DISTINCT
			ON (s.id)
			"s"."id",
			"s"."name" AS "school_name",
			"sa"."name" AS "school_affiliation_name"
		FROM
			"school"."school" s
		LEFT JOIN
			"school_affiliation"."school_affiliation_school" sas
			ON "s"."id" = "sas"."school_id"
		LEFT JOIN
			"school_affiliation"."school_affiliation" sa
			ON	"sas"."school_affiliation_id" = "sa"."id"
		WHERE
		    TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if filter.SchoolId != nil {
		query += fmt.Sprintf(` AND "s"."id" = $%d`, argsIndex)
		args = append(args, *filter.SchoolId)
		argsIndex++
	}
	if filter.SchoolName != nil {
		query += fmt.Sprintf(` AND "s"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+*filter.SchoolName+"%")
		argsIndex++
	}
	if filter.SchoolAffiliationId != nil {
		query += fmt.Sprintf(` AND "sa"."id" = $%d`, argsIndex)
		args = append(args, *filter.SchoolAffiliationId)
		argsIndex++
	}
	if filter.SchoolAffiliationGroup != nil {
		query += fmt.Sprintf(` AND "sa"."school_affiliation_group" = $%d`, argsIndex)
		args = append(args, *filter.SchoolAffiliationGroup)
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
		query += fmt.Sprintf(` ORDER BY "s"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	schoolEntities := []constant.SchoolEntity{}
	err := postgresRepository.Database.Select(&schoolEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return schoolEntities, nil
}
