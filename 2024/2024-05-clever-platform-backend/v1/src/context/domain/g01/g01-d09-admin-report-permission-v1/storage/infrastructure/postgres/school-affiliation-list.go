package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SchoolAffiliationList(filter *constant.SchoolAffiliationFilter, pagination *helper.Pagination) ([]constant.SchoolAffiliationEntity, error) {
	query := `
		SELECT
			"id",
			"name"
		FROM
		    "school_affiliation"."school_affiliation"
		WHERE	
			TRUE
`
	args := []interface{}{}
	argsIndex := 1

	if filter.SchoolAffiliationGroup != nil && *filter.SchoolAffiliationGroup != "" {
		query += fmt.Sprintf(` AND "school_affiliation_group" = $%d`, argsIndex)
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
		query += fmt.Sprintf(` ORDER BY "id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	schoolAffiliationEntities := []constant.SchoolAffiliationEntity{}
	err := postgresRepository.Database.Select(&schoolAffiliationEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return schoolAffiliationEntities, nil
}
