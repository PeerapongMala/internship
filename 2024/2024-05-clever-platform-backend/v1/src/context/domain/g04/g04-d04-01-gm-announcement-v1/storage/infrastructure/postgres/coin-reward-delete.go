package postgres

func (postgresRepository *postgresRepository) DeleteCoinReward(announceId int) error {
	query := `
	DELETE FROM 
	"announcement"."announcement_reward_coin"
	WHERE announcement_reward_id = $1
	`
	_, err := postgresRepository.Database.Exec(query, announceId)
	if err != nil {
		return err
	}
	return nil
}
