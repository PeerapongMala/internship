package postgres

import (
	"fmt"
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jackc/pgx/pgtype"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ObserverAccessList(filter *constant2.ObserverAccessFilter, pagination *helper.Pagination) ([]constant2.ObserverAccessWithSchoolsEntity, error) {
	query := `
		SELECT 
        "observer_access"."id",
        "observer_access"."access_name",
        "observer_access"."name",
        "observer_access"."area_office",
        "observer_access"."district_group",
        "observer_access"."district",
        "observer_access"."school_affiliation_id",
        "observer_access"."status",
        "observer_access"."created_at",
        "observer_access"."created_by",
        "observer_access"."updated_at",
				"user"."user"."first_name" AS "updated_by",
        array_agg( "observer_access_school"."school_id") AS schools
    FROM "auth"."observer_access"
    LEFT JOIN "auth"."observer_access_school"
			ON "auth"."observer_access"."id" =  "auth"."observer_access_school"."observer_access_id"
		LEFT JOIN "user"."user"
			ON "auth"."observer_access"."updated_by" = "user"."user"."id"	
		WHERE TRUE
   
	`
	args := []interface{}{}
	argsIndex := 1
	if filter.AccessName != "" {
		query += fmt.Sprintf(` AND "observer_access"."access_name" = $%d`, argsIndex)
		args = append(args, filter.AccessName)
		argsIndex++
	}
	query += fmt.Sprintf(` GROUP BY "observer_access"."id", "user"."user"."first_name"`)

	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRowx(
		countQuery,
		args...,
	).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
	argsIndex += 2
	args = append(args, pagination.Offset, pagination.Limit)

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	observerAccessList := []constant2.ObserverAccessWithSchoolsEntity{}
	for rows.Next() {
		schools := pgtype.Int4Array{}
		observerAccess := constant2.ObserverAccessWithSchoolsEntity{}
		err := rows.Scan(
			&observerAccess.Id,
			&observerAccess.AccessName,
			&observerAccess.Name,
			&observerAccess.AreaOffice,
			&observerAccess.DistrictGroup,
			&observerAccess.District,
			&observerAccess.SchoolAffiliationId,
			&observerAccess.Status,
			&observerAccess.CreatedAt,
			&observerAccess.CreatedBy,
			&observerAccess.UpdatedAt,
			&observerAccess.UpdatedBy,
			&schools,
		)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		observerAccess.Schools = []int{}
		for _, element := range schools.Elements {
			if element.Status == pgtype.Present {
				observerAccess.Schools = append(observerAccess.Schools, int(element.Int))
			}
		}
		observerAccessList = append(observerAccessList, observerAccess)
	}

	return observerAccessList, nil
}
