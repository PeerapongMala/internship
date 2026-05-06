package postgres

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) RewardAnnounceList(req constant.AnnouncementListRequest, pagination *helper.Pagination) ([]constant.RewardAnnounceResponse, int, error) {
	query := `
	SELECT
	"a"."id" AS "announcement_id",
	"a"."started_at",
	"a"."ended_at",
	"a"."title",
	"a"."description",
	"a"."image_url"
	FROM "announcement"."announcement" a
	LEFT JOIN "announcement"."announcement_reward" ar
	ON "a"."id" = "ar"."announcement_id"
	WHERE "a"."school_id" = $1
	AND "a"."started_at" <= $2
	AND "a"."status" = 'enabled'
	AND "ar"."subject_id" = $3
	AND "a"."scope" = 'Subject'
	AND "a"."type" = 'reward'
	ORDER BY "a"."started_at" LIMIT $4 OFFSET $5

	`
	currentTime := time.Now().UTC()
	rows, err := postgresRepository.Database.Queryx(query, req.SchoolId, currentTime, req.SubjectId, pagination.Limit, pagination.Offset)
	if err != nil {
		return nil, 0, err
	}
	responses := []constant.RewardAnnounceResponse{}
	for rows.Next() {
		response := constant.RewardAnnounceResponse{}
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
	LEFT JOIN "announcement"."announcement_reward" ar
	ON "a"."id" = "ar"."announcement_id"
	WHERE "a"."school_id" = $1
	AND "a"."started_at" <= $2
	AND "a"."status" = 'enabled'
	AND "ar"."subject_id" = $3
	AND "a"."scope" = 'Subject'
	AND "a"."type" = 'reward'
	AND NOT EXISTS (
    SELECT 1 FROM "announcement"."user_announcement" ua
    WHERE ua.announcement_id = a.id AND ua.user_id = $4 AND ua.is_deleted = true
)
	`
	var totalCount int
	err = postgresRepository.Database.QueryRow(countQuery, req.SchoolId, currentTime, req.SubjectId, req.UserId).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}
	return responses, totalCount, nil
}
