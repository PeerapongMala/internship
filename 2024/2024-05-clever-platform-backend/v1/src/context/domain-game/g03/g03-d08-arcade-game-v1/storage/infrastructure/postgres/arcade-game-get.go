package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d08-arcade-game-v1/constant"

func (postgresRepository *postgresRepository) ArcadeGameInfo(arcadeGameId int) (*constant.ArcadeGameInfo, error) {
	query := `
	SELECT
	id,
	name,
	image_url
	FROM "arcade"."arcade_game"
	WHERE id = $1

	`
	response := constant.ArcadeGameInfo{}
	err := postgresRepository.Database.Get(&response, query, arcadeGameId)
	if err != nil {
		return nil, err
	}
	return &response, err
}
