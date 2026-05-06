package postgres

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) EventAnnounceList(req constant.AnnouncementListRequest, pagination *helper.Pagination) ([]constant.EventAnnounceResponse, int, error) {
	query := `
	SELECT
	"a"."id" AS "announcement_id",
	"a"."started_at",
	"a"."ended_at",
	"a"."title",
	"a"."description",
	"a"."image_url",
	"ae"."arcade_game_id",
	"ag"."name" AS "arcade_game_name"
	FROM "announcement"."announcement" a
	LEFT JOIN "announcement"."announcement_event" ae 
	ON "a"."id" = "ae"."announcement_id"
	LEFT JOIN "arcade"."arcade_game" ag
	ON "ae"."arcade_game_id" = "ag"."id"
	LEFT JOIN "announcement"."user_announcement" ua
	ON "a"."id" = "ua"."announcement_id"
	WHERE "a"."school_id" = $1
	AND "a"."started_at" <= $2
	AND "a"."ended_at" >= $3
	AND "a"."status" = 'enabled'
	AND "a"."scope" = 'Subject'
	AND "a"."type" = 'event'
	AND "ae"."subject_id" = $4
	ORDER BY "a"."started_at" LIMIT $5 OFFSET $6

	`
	currentTime := time.Now().UTC().Format("2006-01-02")
	rows, err := postgresRepository.Database.Queryx(query, req.SchoolId, currentTime, currentTime, req.SubjectId, pagination.Limit, pagination.Offset)
	if err != nil {
		return nil, 0, err
	}
	responses := []constant.EventAnnounceResponse{}
	for rows.Next() {
		response := constant.EventAnnounceResponse{}

		err := rows.StructScan(&response)
		if err != nil {
			return nil, 0, err
		}
		req := constant.AnnouncementFilterRequest{
			UserId:         req.UserId,
			AnnouncementId: response.AnnouncementId,
		}
		exist, err := postgresRepository.AnnouncementFilter(req)
		if err != nil {
			return nil, 0, err
		}
		if exist {
			continue
		}
		responses = append(responses, response)
	}

	countQuery := `
	SELECT COUNT (*) 
	FROM "announcement"."announcement" a
	LEFT JOIN "announcement"."announcement_event" ae 
	ON "a"."id" = "ae"."announcement_id"
	LEFT JOIN "arcade"."arcade_game" ag
	ON "ae"."arcade_game_id" = "ag"."id"
	LEFT JOIN "announcement"."user_announcement" ua
	ON "a"."id" = "ua"."announcement_id"
	WHERE "a"."school_id" = $1
	AND "a"."started_at" <= $2
	AND "a"."ended_at" >= $3
	AND "a"."status" = 'enabled'
	AND "a"."scope" = 'Subject'
	AND "a"."type" = 'event'
	AND "ae"."subject_id" = $4

	`
	var totalCount int
	err = postgresRepository.Database.QueryRow(countQuery, req.SchoolId, currentTime, currentTime, req.SubjectId).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}
	return responses, totalCount, nil

}
