package postgres

func (postgresRepository *postgresRepository) CheckItemExist(announceId int) (bool, error) {
	query := `
	SELECT EXISTS (
    SELECT 1
    FROM "announcement"."announcement_reward_item"
    WHERE announcemnet_reward_id = $1
);
	`
	var exist bool
	err := postgresRepository.Database.QueryRow(query, announceId).Scan(&exist)
	if err != nil {
		return exist, err
	}
	return exist, nil
}
