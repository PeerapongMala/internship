package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/constant"

func (postgresRepository *postgresRepository) CreatePlayId(req constant.CreatePlayIdRequest) error {
	query := `
	INSERT INTO "arcade"."play_id" (
	play_id,
	user_id,
	arcade_game_id
	)
	VALUES ($1,$2,$3)
	`
	_, err := postgresRepository.Database.Exec(query, req.PlayId, req.UserId, req.ArcadeGameId)
	if err != nil {
		return err
	}
	return nil
}
