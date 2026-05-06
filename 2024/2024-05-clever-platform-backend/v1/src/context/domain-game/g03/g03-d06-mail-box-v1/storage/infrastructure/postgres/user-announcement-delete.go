package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"

func (postgresRepository *postgresRepository) UpdateDelete(req constant.AnnouncementDeleteRequest) error {
	query := `
	UPDATE "announcement"."user_announcement"
	SET is_deleted = $1
	WHERE announcement_id = $2
	AND user_id = $3
	`

	_, err := postgresRepository.Database.Exec(query, true, req.AnnouncementId, req.UserId)
	if err != nil {
		return err
	}
	return nil
}
