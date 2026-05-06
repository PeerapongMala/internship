package postgres

func (postgresRepository *postgresRepository) CheckRead(announceId int, UserId string) (bool, error) {
	query := `
	SELECT EXISTS (
    SELECT 1
    FROM "announcement"."user_announcement"
    WHERE user_id = $1
      AND announcement_id = $2
      AND is_read = true
);
	`
	var exist bool
	err := postgresRepository.Database.QueryRow(query, UserId, announceId).Scan(&exist)
	if err != nil {
		return exist, err
	}
	return exist, err
}
