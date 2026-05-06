package postgres

func (postgresRepository *postgresRepository) DeletePlayIdByArcadeGameId(ArcadeGameId int, UserId string) error {
	query := `
DELETE FROM "arcade"."play_id"
WHERE arcade_game_id = $1 AND user_id = $2
`
	_, err := postgresRepository.Database.Exec(query, ArcadeGameId, UserId)
	if err != nil {
		return err
	}
	return nil
}
