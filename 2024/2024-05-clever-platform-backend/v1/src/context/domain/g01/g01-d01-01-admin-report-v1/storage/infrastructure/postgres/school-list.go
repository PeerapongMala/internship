package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) SchoolList(pagination *helper.Pagination, affiliationType string, scope string) ([]constant.SchoolEntity, error) {
	query := `	
		SELECT
		    "s"."id",
			"s"."name",
			COUNT(*) OVER() AS "total_count"
		FROM
	`
	args := []interface{}{}
	argsIndex := len(args) + 1

	switch affiliationType {
	case constant.Obec:
		query += `
			"school_affiliation"."school_affiliation_obec" sao
			INNER JOIN	
				"school_affiliation"."school_affiliation" sa ON "sao"."school_affiliation_id" = "sa"."id"
		`
	case constant.Doe:
		query += `
			"school_affiliation"."school_affiliation_doe" sad
			INNER JOIN	
				"school_affiliation"."school_affiliation" sa ON "sad"."school_affiliation_id" = "sa"."id"
		`
	case constant.Lao:
		query += `
			"school_affiliation"."school_affiliation_lao" sal
			INNER JOIN	
				"school_affiliation"."school_affiliation" sa ON "sal"."school_affiliation_id" = "sa"."id"
		`
	default:
		query += `"school_affiliation"."school_affiliation" sa `
	}

	query += `
		INNER JOIN
			"school_affiliation"."school_affiliation_school" sas ON "sas"."school_affiliation_id" = "sa"."id"
		INNER JOIN
			"school"."school" s ON "sas"."school_id" = "s"."id"
		WHERE
			TRUE
	`

	if scope != "" {
		switch affiliationType {
		case constant.Obec:
			query += fmt.Sprintf(` AND "sao"."area_office" = $%d`, argsIndex)
			argsIndex++
			args = append(args, scope)
		case constant.Doe:
			query += fmt.Sprintf(` AND "sad"."district" = $%d`, argsIndex)
			argsIndex++
			args = append(args, scope)
		case constant.Lao:
			query += fmt.Sprintf(` AND "sal"."province" = $%d`, argsIndex)
			argsIndex++
			args = append(args, scope)
		}
	}
	query += fmt.Sprintf(` AND "sa"."school_affiliation_group" = $%d`, argsIndex)
	argsIndex++
	args = append(args, constant.AffiliationTypeToThai(affiliationType))

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY "s"."name" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	schools := []constant.SchoolEntity{}
	err := postgresRepository.Database.Select(&schools, query, args...)
	if err != nil {
		return nil, err
	}

	if len(schools) > 0 {
		helper.DerefPagination(pagination).TotalCount = schools[0].TotalCount
	}

	return schools, nil
}
