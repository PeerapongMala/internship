package postgres

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d08-arcade-game-v1/constant"
)

func (postgresRepository *postgresRepository) GetEventDateBySchoolId(schoolId int, arcadeGameId int) ([]constant.AnnouncementEventTimeStamp, error) {

	query := `
	SELECT
		"a"."title",
		"a"."started_at",
		"a"."ended_at"
	FROM "announcement"."announcement" a
	LEFT JOIN "announcement"."announcement_event" ae
	ON "a"."id" = "ae"."announcement_id"
	WHERE "a"."scope" = 'Subject' AND "a"."type" = 'event' 
		AND "a"."started_at" <= $1 
		AND "a"."ended_at" > $2
		AND "a"."school_id" = $3
		AND "ae"."arcade_game_id" = $4
		AND "a"."status" = 'enabled'
		ORDER BY "a"."started_at"
	`

	currentTime := time.Now().UTC()
	responses := []constant.AnnouncementEventTimeStamp{}
	err := postgresRepository.Database.Select(&responses, query, currentTime, currentTime, schoolId, arcadeGameId)
	if err != nil {
		return nil, err
	}

	return responses, nil
}
