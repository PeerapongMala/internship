package postgres

func (postgresRepository *postgresRepository) DeleteAnnouncementItem(announceId int, ItemId int) error {
	query := `
	DELETE FROM "announcement"."announcement_reward_item"
	WHERE "item_id" = $1
	AND "announcemnet_reward_id" = $2

	`
	_, err := postgresRepository.Database.Exec(query, ItemId, announceId)
	if err != nil {
		return err
	}
	return nil
}
