package postgres

func (postgresRepository *postgresRepository) ReadByAnnouncementId(announcementId int, userId string) error {
	query := `
	INSERT INTO "announcement"."user_announcement"
	(
	user_id,
	announcement_id,
	is_read
	) VALUES ($1,$2,$3)
	
	`
	_, err := postgresRepository.Database.Exec(query, userId, announcementId, true)
	if err != nil {
		return err
	}
	return nil
}
