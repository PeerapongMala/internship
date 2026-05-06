package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
)

func (postgresRepository *postgresRepository) AnnouncementFilter(req constant.AnnouncementFilterRequest) (bool, error) {
	query := `
	SELECT EXISTS (
	SELECT 1 FROM "announcement"."user_announcement"
	WHERE user_id = $1
	AND announcement_id = $2
	AND is_deleted = true);

	`
	var exist bool
	err := postgresRepository.Database.QueryRow(query, req.UserId, req.AnnouncementId).Scan(&exist)
	if err != nil {
		return exist, err
	}
	return exist, nil
}
