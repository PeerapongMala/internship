package postgres

import (
	"fmt"
	"log"
	"strconv"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolCaseListBySchoolAffiliation(pagination *helper.Pagination, searchText string, schoolAffiliationId int) ([]constant2.ContractSchoolDataEntity, error) {
	query := `
		SELECT
			"school_affiliation_group"
		FROM "school_affiliation"."school_affiliation"
		WHERE
			"id" = $1	
	`
	var schoolAffiliationGroup string
	err := postgresRepository.Database.QueryRowx(query, schoolAffiliationId).Scan(&schoolAffiliationGroup)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query = `
		SELECT
			"s"."id",
			"s"."code",
			"s"."name"	
		FROM "school_affiliation"."school_affiliation_school" ss
		LEFT JOIN "school"."school" s	
			ON  "ss"."school_id" = "s"."id"
		WHERE
			"ss"."school_affiliation_id" = $1
	`
	args := []interface{}{schoolAffiliationId}
	argsIndex := 2
	if searchText != "" {
		query += fmt.Sprintf(` AND ("s"."name" ILIKE $%d`, argsIndex)
		argsIndex++
		arg := "%" + searchText + "%"
		args = append(args, arg)
		intSearchText, err := strconv.Atoi(searchText)
		if err == nil {
			query += fmt.Sprintf(` OR "s"."id" = $%d`, argsIndex)
			args = append(args, intSearchText)
			argsIndex++
		}
		query += ")"
	}
	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "s"."id" LIMIT $%d OFFSET $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Limit, pagination.Offset)
		argsIndex = argsIndex + 2
	}

	contractSchoolDataEntities := []constant2.ContractSchoolDataEntity{}
	err = postgresRepository.Database.Select(&contractSchoolDataEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return contractSchoolDataEntities, nil
}
