package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/constant"

func (postgresRepository *postgresRepository) CheckPlayIdSession(req constant.CheckPlayIdRequest) (bool, error) {

	query := `
	   SELECT EXISTS (
		   SELECT 1 FROM "arcade"."play_id" WHERE  user_id = $1 AND arcade_game_id = $2
	   )
	   `
	var exists bool
	err := postgresRepository.Database.QueryRow(query, req.UserId, req.ArcadeGameId).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil

}
