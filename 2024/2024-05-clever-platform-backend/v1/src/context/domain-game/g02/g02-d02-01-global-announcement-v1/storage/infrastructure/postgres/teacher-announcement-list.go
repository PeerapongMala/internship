package postgres

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-01-global-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRespository *postgresRepository) TeacherAnnoucementList(schoolId int, pagination *helper.Pagination) ([]constant.AnnouncementResponse, int, error) {
	query := `
	SELECT
	"a"."id" AS "announcement_id",
	"a"."started_at",
	"a"."ended_at",
	"a"."title",
	"a"."description",
	"a"."image_url"
	FROM "announcement"."announcement" a
	LEFT JOIN "school"."school"s
	ON "a"."school_id" = "s"."id"
	WHERE "s"."id" = $1
	AND "a"."started_at" <= $2
	AND "a"."ended_at" >= $3
	AND "a"."status" = 'enabled'
	AND "a"."scope" = 'School' AND "a"."type" = 'teacher'
	ORDER BY "a"."started_at" LIMIT $4 OFFSET $5
	`
	currentTime := time.Now().UTC()
	rows, err := postgresRespository.Database.Queryx(query, schoolId, currentTime, currentTime, pagination.Limit, pagination.Offset)
	if err != nil {
		return nil, 0, err
	}
	responses := []constant.AnnouncementResponse{}
	for rows.Next() {
		response := constant.AnnouncementResponse{}
		err = rows.StructScan(&response)
		if err != nil {
			return nil, 0, err
		}
		responses = append(responses, response)

	}
	countQuery := `
	SELECT COUNT(*)
	FROM "announcement"."announcement" a
	LEFT JOIN "school"."school"s
	ON "a"."school_id" = "s"."id"
	WHERE "s"."id" = $1
	AND "a"."started_at" <= $2
	AND "a"."ended_at" >= $3
	AND "a"."status" = 'enabled'
	AND "a"."scope" = 'School' AND "a"."type" = 'teacher'
	`
	var totalCount int
	err = postgresRespository.Database.QueryRow(countQuery, schoolId, currentTime, currentTime).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}
	return responses, totalCount, nil
}
