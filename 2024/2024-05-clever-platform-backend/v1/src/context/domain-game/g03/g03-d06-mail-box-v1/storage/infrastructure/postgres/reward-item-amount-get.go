package postgres

func (postgresRepository *postgresRepository) GetRewardItemAmount(rewardId int) (int, error) {
	query := `
	SELECT 
	amount
	FROM "teacher_item"."teacher_reward_transaction"
	WHERE id = $1
	`
	var amount int
	err := postgresRepository.Database.QueryRow(query, rewardId).Scan(&amount)
	if err != nil {
		return amount, err
	}
	return amount, err
}
