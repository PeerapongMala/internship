package postgres

import (
	"database/sql"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/constant"
)

func (postgresRepository *postgresRepository) GetArcadeGameConfigId(ArcadeGameId int) (*constant.ArcadeGameConfig, error) {
	query := `
	SELECT
	"ag"."id" AS "arcade_game_id",
	"ag"."url",
	"agc"."config_id"
	FROM "arcade"."arcade_game"ag
	LEFT JOIN "arcade"."arcade_game_config" agc
	ON "ag"."id" = "agc"."arcade_game_id"
	WHERE arcade_game_id = $1
`
	row := postgresRepository.Database.QueryRow(query, ArcadeGameId)
	response := constant.ArcadeGameConfig{}
	err := row.Scan(
		&response.ArcadeGameId,
		&response.ArcadeGameUrl,
		&response.ConfigId,
	)
	if err == sql.ErrNoRows {

		response.ArcadeGameId = ArcadeGameId
		response.ConfigId = 0
		return &response, nil
	} else if err != nil {
		return nil, err
	}

	return &response, nil
}
