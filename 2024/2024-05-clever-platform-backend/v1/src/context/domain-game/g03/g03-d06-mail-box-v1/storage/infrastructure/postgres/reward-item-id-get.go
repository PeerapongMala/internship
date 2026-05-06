package postgres

func (postgresRepository *postgresRepository) GetItemIdByRewardId(rewardId int) (int, error) {
	query := `
	SELECT 
	item_id
	FROM "teacher_item"."teacher_reward_transaction"
	WHERE id = $1
		AND "status" = 'send'
	`
	var itemId int
	err := postgresRepository.Database.QueryRow(query, rewardId).Scan(&itemId)
	if err != nil {
		return itemId, err
	}
	return itemId, err
}
