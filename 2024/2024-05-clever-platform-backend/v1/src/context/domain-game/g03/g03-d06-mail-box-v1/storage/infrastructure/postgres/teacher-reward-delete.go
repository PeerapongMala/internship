package postgres

func (postgresRepository *postgresRepository) RewardDelete(rewardId int) error {
	query := `
	UPDATE "teacher_item"."teacher_reward_transaction"
	SET is_deleted = true
	WHERE id = $1
	`
	_, err := postgresRepository.Database.Exec(query, rewardId)
	if err != nil {
		return err
	}
	return nil
}
