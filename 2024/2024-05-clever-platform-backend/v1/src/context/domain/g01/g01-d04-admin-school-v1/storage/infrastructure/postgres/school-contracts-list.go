package postgres

import (
	"fmt"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) GetSchoolContracts(SchoolId int, filter constant.FilterSchoolContract, pagination *helper.Pagination) ([]constant.SchoolContractsResponse, int, error) {
	query := `SELECT 
	"s"."id"  ,
	"s"."name" AS "school_name",
	"ct"."id" AS "contract_ic" ,
	"ct"."name" AS "contract_name",
	"sa"."id" AS "school_affiliation_id",
	"sa"."name" AS "school_affiliation_name",
	"ct"."start_date",
	"ct"."end_date",
	"ct"."status" AS "contract_status",
	"ct"."created_at",
	"ct"."created_by",
	"ct"."updated_at",
	"u"."first_name" AS "updated_by"
	FROM "school_affiliation"."contract_school" cts
		LEFT JOIN "school_affiliation"."contract" ct
		ON "cts"."contract_id" = "ct"."id"
		LEFT JOIN "school"."school" s
		ON "cts"."school_id" = "s"."id"
		LEFT JOIN "school_affiliation"."school_affiliation" sa
		ON "ct"."school_affiliation_id" = "sa"."id"
		LEFT JOIN "user"."user" u
		ON "ct"."updated_by" = "u"."id"
	WHERE "s"."id" = $1
	
	`
	Args := []interface{}{SchoolId}
	argI := 2

	if filter.SearchText != "" {

		searchText := filter.SearchText
		id := 0
		id, _ = strconv.Atoi(filter.SearchText)
		if id != 0 {
			searchText = filter.SearchText
			query += fmt.Sprintf(` AND "ct"."id" = $%d `, argI)
			Args = append(Args, searchText)
		} else {
			searchText = fmt.Sprintf("%%%s%%", filter.SearchText)
			query += fmt.Sprintf(` AND "ct"."name" ILIKE $%d`, argI)
			Args = append(Args, searchText)
		}
		argI++
	}

	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	var totalCount int
	err := postgresRepository.Database.QueryRow(countQuery, Args...).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}

	query += fmt.Sprintf(` ORDER BY "ct"."id" LIMIT $%d OFFSET $%d`, argI, argI+1)
	Args = append(Args, pagination.Limit, pagination.Offset)
	rows, err := postgresRepository.Database.Query(query, Args...)
	if err != nil {
		return nil, 0, err
	}
	responses := []constant.SchoolContractsResponse{}
	for rows.Next() {
		response := constant.SchoolContractsResponse{}
		rows.Scan(
			&response.SchoolId,
			&response.SchoolName,
			&response.ContractId,
			&response.ContractName,
			&response.SchoolAffiliationId,
			&response.SchoolAffiliationName,
			&response.StartDate,
			&response.EndDate,
			&response.Status,
			&response.CreatedAt,
			&response.CreatedBy,
			&response.UpdatedAt,
			&response.UpdatedBy,
		)
		responses = append(responses, response)
	}

	return responses, totalCount, nil
}
