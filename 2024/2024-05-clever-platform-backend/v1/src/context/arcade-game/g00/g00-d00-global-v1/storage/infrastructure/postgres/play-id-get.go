package postgres

func (postgresRepository *postgresRepository) PlayIdGet(ArcadeGameId int, UserId string) (string, error) {
	query := `SELECT
	play_id
	FROM "arcade"."play_id"
	WHERE arcade_game_id = $1 AND user_id = $2
	`
	var PlayId string
	err := postgresRepository.Database.QueryRow(query, ArcadeGameId, UserId).Scan(&PlayId)
	if err != nil {
		return "", err
	}

	return PlayId, nil
}
