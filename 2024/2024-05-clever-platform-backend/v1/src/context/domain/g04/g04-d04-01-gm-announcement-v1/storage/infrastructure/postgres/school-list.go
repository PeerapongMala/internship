package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) SchoolList(pagination *helper.Pagination) ([]constant.SchoolList, int, error) {
	query := `
	SELECT DISTINCT ON ("id")
	id,
	name
	FROM "school"."school"
	ORDER BY id
	LIMIT $1 OFFSET $2
	`
	rows, err := postgresRepository.Database.Query(query, pagination.Limit, pagination.Offset)
	if err != nil {
		return nil, 0, err
	}
	responses := []constant.SchoolList{}
	for rows.Next() {
		response := constant.SchoolList{}
		rows.Scan(
			&response.SchoolId,
			&response.SchoolName,
		)
		responses = append(responses, response)
	}
	countQuery := `
	SELECT COUNT(*)
	FROM "school"."school"
	`
	var totalCount int
	postgresRepository.Database.QueryRow(countQuery).Scan(&totalCount)

	return responses, totalCount, nil
}
