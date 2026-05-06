package postgres

import (
	"fmt"
	"log"
	"strconv"

	"github.com/pkg/errors"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresrepository *postgresRepository) SchoolList(filter constant.SchoolListFilter, pagination *helper.Pagination) ([]constant.SchoolListResponse, error) {
	query := `
	SELECT DISTINCT ON ("s"."id")
	"s"."id",
	"s"."code",
	"s"."name",
	"s"."province",
	"sa"."id" AS "school_affiliation_id",
	"sa"."type" AS "school_affiliation_type",
	"sa"."name" AS "school_affiliation_name",
	"sa"."short_name" AS "school_affiliation_short_name",
	"s"."status",
	COUNT("cs"."school_id") AS "contract_count" ,
	"s"."created_at",
	"s"."created_by",
	"s"."updated_at",
	"u"."first_name" AS "updated_by"
	FROM "school"."school" s
	LEFT JOIN "school_affiliation"."school_affiliation_school" sas
	ON "s"."id" = "sas"."school_id"
	LEFT JOIN "school_affiliation"."school_affiliation" sa
	ON "sas"."school_affiliation_id" = "sa"."id"
	LEFT JOIN "user"."user" u
	ON "s"."updated_by" = "u"."id"
	LEFT JOIN "school_affiliation"."contract_school" cs
	ON "s"."id" = "cs"."school_id"
	
	`
	args := []interface{}{}
	whereClause := false
	argsI := 1
	if filter.SearchText != "" {
		if whereClause {
			query += ` AND `
		} else {
			query += ` WHERE `
			whereClause = true
		}
		query += fmt.Sprintf(`("s"."id"::TEXT = $%d 
								OR "s"."name" ILIKE $%d 
								OR "s"."code" ILIKE $%d
								OR "sa"."name" ILIKE $%d)`, argsI, argsI, argsI, argsI)

		searchText := filter.SearchText
		id := 0
		id, _ = strconv.Atoi(filter.SearchText)
		if id != 0 {
			searchText = filter.SearchText
		} else {

			searchText = fmt.Sprintf("%%%s%%", filter.SearchText)
		}

		args = append(args, searchText)
		argsI++
	}
	// if filter.SchoolName != "" {
	// 	if whereClause {
	// 		query += ` AND `
	// 	} else {
	// 		query += ` WHERE `
	// 		whereClause = true
	// 	}
	// 	query += fmt.Sprintf(`"s"."name" ILIKE $%d `, argsI)
	// 	args = append(args, "%"+filter.SchoolName+"%")
	// 	argsI++
	// }
	if filter.SchoolAffiliationId != 0 {
		if whereClause {
			query += ` AND `
		} else {
			query += ` WHERE `
			whereClause = true
		}
		query += fmt.Sprintf(`"sa"."id" = $%d`, argsI)
		args = append(args, filter.SchoolAffiliationId)
		argsI++
	}
	// if filter.SchoolAffiliationName != "" {
	// 	if whereClause {
	// 		query += ` AND `
	// 	} else {
	// 		query += ` WHERE `
	// 		whereClause = true
	// 	}
	// 	query += fmt.Sprintf(`"sa"."name" ILIKE $%d `, argsI)
	// 	args = append(args, "%"+filter.SchoolAffiliationName+"%")
	// 	argsI++
	// }

	if filter.Province != "" {
		if whereClause {
			query += ` AND `
		} else {
			query += ` WHERE `
			whereClause = true
		}
		query += fmt.Sprintf(`"s"."province" ILIKE $%d`, argsI)
		args = append(args, "%"+filter.Province+"%")
		argsI++
	}
	if filter.Status != "" {
		if whereClause {
			query += ` AND `
		} else {
			query += ` WHERE `
			whereClause = true
		}
		query += fmt.Sprintf(`"s"."status" = $%d `, argsI)
		args = append(args, filter.Status)
		argsI++

	}
	query += fmt.Sprintf(`
	GROUP BY 
		"s"."id",
		"s"."code",
		"s"."name",
		"s"."province",
		"sa"."id",
		"sa"."type",
		"sa"."name",
		"sa"."short_name",
		"s"."status",
		"s"."created_at",
		"s"."created_by",
		"s"."updated_at",
		"u"."first_name"
		ORDER BY "s"."id"
	`)

	if pagination != nil {
		countQuery := fmt.Sprintf(` SELECT COUNT(*) FROM (%s)`, query)
		err := postgresrepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsI, argsI+1)
		argsI += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	responses := []constant.SchoolListResponse{}
	err := postgresrepository.Database.Select(&responses, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return responses, nil
}
