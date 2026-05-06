package postgres

func (postgresRepository *postgresRepository) CheckTeacherRewardReceived(rewardId int) (bool, error) {
	query := `
	SELECT EXISTS (
		SELECT 1 
		FROM "teacher_item"."teacher_reward_transaction"
		WHERE id = $1
		AND status = 'received'
	);
	`
	var received bool
	err := postgresRepository.Database.QueryRow(query, rewardId).Scan(&received)
	if err != nil {
		return received, err
	}
	return received, nil
}
