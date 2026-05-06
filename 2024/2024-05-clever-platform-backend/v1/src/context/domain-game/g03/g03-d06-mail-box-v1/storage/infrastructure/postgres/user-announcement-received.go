package postgres

func (postgresRepository *postgresRepository) UserAnnouncementReceived(announceId int, UserId string) error {
	query := `
	UPDATE "announcement"."user_announcement"
	SET is_received = $1
	WHERE user_id = $2
	AND announcement_id = $3
	`
	_, err := postgresRepository.Database.Exec(query, true, UserId, announceId)
	if err != nil {
		return err
	}
	return nil
}
