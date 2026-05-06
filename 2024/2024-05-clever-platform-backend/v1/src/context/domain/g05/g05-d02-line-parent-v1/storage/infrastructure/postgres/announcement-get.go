package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AnnouncementGet(AnnouncementID int) (*constant.Announcement, error) {
	query := `
		SELECT
			id,
			title,
			type,
			description
		FROM announcement.announcement
		WHERE 
			id = $1
	`

	args := []interface{}{AnnouncementID}
	announcement := constant.Announcement{}
	err := postgresRepository.Database.QueryRowx(query, args...).StructScan(&announcement)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("Announcement ID is not exist")
		}
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &announcement, nil
}
