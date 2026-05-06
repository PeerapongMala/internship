package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-global-zone-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetAnnouncementGlobalZone(schoolId int, userId string, announcementType string) ([]constant.AnnouncementEntity, error) {
	query := `
		SELECT
			"a"."id" AS "announcement_id",
			"a"."started_at",
			"a"."ended_at",
			"a"."title",
			"a"."description",
			"a"."image_url",
			"ua".is_read,
			"ua".is_deleted,
			"ua".is_received
		FROM "announcement"."announcement" a
		LEFT JOIN "announcement"."announcement_system" asm
		ON "a"."id" = "asm"."announcement_id"
		left join announcement.user_announcement ua 
		on ua.announcement_id = a.id
		WHERE "a"."school_id" = $1
		AND "a"."status" = 'enabled'
		AND "a"."scope" = 'School'
		AND "a"."type" = $2
		AND now() between "a"."started_at" and  "a"."ended_at"
		and ( ua.user_id = $3 or ua.user_id is null)
		and ( ua.is_deleted = false or ua.is_deleted is null)
		order by started_at 
	`


	entities := []constant.AnnouncementEntity{}
	err := postgresRepository.Database.Select(&entities, query, schoolId, announcementType, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, err
}