package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) SchoolAffiliationDoeList(pagination *helper.Pagination) ([]constant.SchoolAffiliationDoeList, int, error) {
	query := `
 SELECT
	"sa"."id" AS "school_affiliation_doe_id",
	"sa"."name" AS "school_affiliation_doe_name"
	FROM "school_affiliation"."school_affiliation_doe" sae
	LEFT JOIN "school_affiliation"."school_affiliation" sa
	ON "sae"."school_affiliation_id" = "sa"."id"
	ORDER BY "sa"."id"
	LIMIT $1 OFFSET $2
 `
	rows, err := postgresRepository.Database.Query(query, pagination.Limit, pagination.Offset)
	if err != nil {
		return nil, 0, err
	}
	responses := []constant.SchoolAffiliationDoeList{}
	for rows.Next() {
		response := constant.SchoolAffiliationDoeList{}
		rows.Scan(
			&response.SchoolAffilationId,
			&response.SchoolAffiliationName,
		)
		responses = append(responses, response)
	}
	countQuery :=
		`
	SELECT COUNT(*)
	FROM "school_affiliation"."school_affiliation_doe" sae
	LEFT JOIN "school_affiliation"."school_affiliation" sa
	ON "sae"."school_affiliation_id" = "sa"."id"
	`
	var totalCount int
	err = postgresRepository.Database.QueryRow(countQuery).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}

	return responses, totalCount, nil
}
