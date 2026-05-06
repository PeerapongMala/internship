package postgres

func (postgresRepository *postgresRepository) GetArcadeCoinCost(ArcadeGameId int) (int, error) {
	query := `
	SELECT 
	arcade_coin_cost 
	FROM "arcade"."arcade_game"
	WHERE id = $1
	`
	var arcadeCoinCost int
	err := postgresRepository.Database.QueryRow(query, ArcadeGameId).Scan(&arcadeCoinCost)
	if err != nil {
		return 0, err
	}
	return arcadeCoinCost, nil
}
