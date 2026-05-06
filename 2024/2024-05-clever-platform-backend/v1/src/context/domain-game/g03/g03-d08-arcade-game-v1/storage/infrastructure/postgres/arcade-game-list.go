package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d08-arcade-game-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) ArcadeGameList(pagination *helper.Pagination) ([]constant.ArcadeGameResponse, int, error) {
	query := `
	SELECT
	id,
	name,
	image_url,
	arcade_coin_cost
	FROM "arcade"."arcade_game"
	ORDER BY id LIMIT $1 OFFSET $2
 	`
	rows, err := postgresRepository.Database.Queryx(query, pagination.Limit, pagination.Offset)
	if err != nil {
		return nil, 0, err
	}

	responses := []constant.ArcadeGameResponse{}

	for rows.Next() {
		response := constant.ArcadeGameResponse{}
		err := rows.StructScan(&response)
		if err != nil {
			return nil, 0, err
		}
		responses = append(responses, response)
	}

	countQuery :=
		`SELECT COUNT(*)
	FROM "arcade"."arcade_game"
	`
	var totalCount int
	err = postgresRepository.Database.QueryRow(countQuery).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}
	return responses, totalCount, nil
}
