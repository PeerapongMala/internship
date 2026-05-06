package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d09-admin-report-permission-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ObserverAccessCaseListSchool(filter *constant.ObserverAccessSchoolFilter, pagination *helper.Pagination) ([]constant.ObserverAccessSchoolEntity, error) {
	query := `
		SELECT 
			"s"."id",
			"s"."code",
			"s"."name",
			"sa"."name" AS "school_affiliation"
		FROM
		    "auth"."observer_access_school" oas
		LEFT JOIN
			"school"."school" s
			ON "oas"."school_id" = "s"."id"
		LEFT JOIN
			"school_affiliation"."school_affiliation_school" sas
			ON "s"."id" = "sas"."school_id" 
		LEFT JOIN
		    "school_affiliation"."school_affiliation" sa
			ON "sas"."school_affiliation_id" = "sa"."id" 
		WHERE
			"observer_access_id" = $1	
`
	args := []interface{}{filter.ObserverAccessId}
	argsIndex := 2

	if filter.Id != nil && *filter.Id != 0 {
		query += fmt.Sprintf(` AND "s"."id" = $%d`, argsIndex)
		args = append(args, filter.Id)
		argsIndex++
	}
	if filter.Name != nil {
		query += fmt.Sprintf(` AND "s"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+*filter.Name+"%")
		argsIndex++
	}
	if filter.Code != nil {
		query += fmt.Sprintf(` AND "s"."code" ILIKE $%d`, argsIndex)
		args = append(args, "%"+*filter.Code+"%")
		argsIndex++
	}
	if filter.SchoolAffiliation != nil {
		query += fmt.Sprintf(` AND "sa"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+*filter.SchoolAffiliation+"%")
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(` SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "s"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	observerAccessSchoolEntities := []constant.ObserverAccessSchoolEntity{}
	err := postgresRepository.Database.Select(&observerAccessSchoolEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return observerAccessSchoolEntities, nil
}
