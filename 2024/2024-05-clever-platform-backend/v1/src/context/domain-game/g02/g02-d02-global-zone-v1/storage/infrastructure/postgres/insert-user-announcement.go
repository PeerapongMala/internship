package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-global-zone-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) InsertUserAnnouncement(entity *constant.UserAnnouncementEntity) (error) {
	query := `
		INSERT INTO announcement.user_announcement (
		  "user_id",
			"announcement_id",	
			"is_read",
			"is_deleted",
			"is_received"
		)
		VALUES ($1, $2, $3, $4, $5);
	`

	err := postgresRepository.Database.QueryRowx(
		query,
		entity.UserId,
		entity.AnnouncementId,
		entity.IsRead,
		entity.IsDeleted,
		entity.IsReceived,
	).Err()
	
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}