package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) ProvinceList(pagination *helper.Pagination) ([]constant.ProvinceList, int, error) {
	query := `
	SELECT DISTINCT
	province
	FROM "school"."school"
	LIMIT $1 OFFSET $2
	`
	rows, err := postgresRepository.Database.Query(query, pagination.Limit, pagination.Offset)
	if err != nil {
		return nil, 0, err
	}

	responses := []constant.ProvinceList{}
	for rows.Next() {
		response := constant.ProvinceList{}
		rows.Scan(
			&response.Province,
		)
		responses = append(responses, response)
	}
	countQuery :=
		`
	SELECT COUNT(DISTINCT province) FROM "school"."school"
	`

	var totalCount int
	err = postgresRepository.Database.QueryRow(countQuery).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}
	return responses, totalCount, nil
}
