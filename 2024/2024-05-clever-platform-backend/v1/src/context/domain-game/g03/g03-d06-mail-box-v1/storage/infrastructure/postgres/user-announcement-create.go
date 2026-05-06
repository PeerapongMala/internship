package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"

func (postgresRepository *postgresRepository) AnnouncementRead(req constant.AnnouncementReadRequest) error {
	query := `
	INSERT INTO "announcement"."user_announcement"
	(
	user_id,
	announcement_id,
	is_read,
	is_deleted,
	is_received
	) VALUES ($1,$2,$3,$4,$5)
	`

	_, err := postgresRepository.Database.Exec(
		query,
		req.UserId,
		req.AnnouncementId,
		true,
		false,
		false,
	)
	if err != nil {
		return err
	}
	return nil
}
