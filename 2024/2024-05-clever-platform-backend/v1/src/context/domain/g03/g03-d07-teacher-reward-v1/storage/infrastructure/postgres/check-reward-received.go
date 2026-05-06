package postgres

func (postgresRepository *postgresRepository) CheckReceived(id int) (bool, error) {
	query := `
 SELECT EXISTS (
	 SELECT 1
    FROM "teacher_item"."teacher_reward_transaction"
    WHERE id = $1
      AND status = 'received'
);
 `
	var exist bool

	err := postgresRepository.Database.QueryRow(query, id).Scan(&exist)
	if err != nil {
		return exist, err
	}
	return exist, nil
}
