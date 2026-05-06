package postgres

import (
	"log"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-global-zone-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UpdateUserAnnouncement(entity *constant.UserAnnouncementEntity) error {
	query := "UPDATE announcement.user_announcement SET "
	params := []interface{}{}
	paramID := 1

	if entity.IsRead != nil {
		query += `"is_read" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.IsRead)
		paramID++
	}

	if entity.IsDeleted != nil {
		query += `"is_deleted" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.IsDeleted)
		paramID++
	}	
	
	// Remove trailing comma and space if any conditions were met
	if len(params) > 0 {
		query = query[:len(query)-2]
	}

	query += ` WHERE "user_id" = $` + strconv.Itoa(paramID)
	params = append(params, entity.UserId)
	paramID++

	query += ` AND "announcement_id" = $` + strconv.Itoa(paramID)
	params = append(params, entity.AnnouncementId)

	_, err := postgresRepository.Database.Exec(query, params...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}