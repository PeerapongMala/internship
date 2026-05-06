package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) ArcadeGameList(pagination *helper.Pagination) ([]constant.ArcadeGameList, int, error) {
	query := `
	SELECT
	id,
	name
	FROM "arcade"."arcade_game"
	ORDER BY id LIMIT $1 OFFSET $2
	`
	rows, err := postgresRepository.Database.Query(query, pagination.Limit, pagination.Offset)
	if err != nil {
		return nil, 0, err
	}
	responses := []constant.ArcadeGameList{}
	for rows.Next() {
		response := constant.ArcadeGameList{}
		rows.Scan(
			&response.ArcadeGameId,
			&response.ArcadeGameName,
		)
		responses = append(responses, response)
	}
	countQuery := `
	SELECT COUNT(*)
	FROM "arcade"."arcade_game"
	`
	var totalCount int
	err = postgresRepository.Database.QueryRow(countQuery).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}
	return responses, totalCount, nil
}
