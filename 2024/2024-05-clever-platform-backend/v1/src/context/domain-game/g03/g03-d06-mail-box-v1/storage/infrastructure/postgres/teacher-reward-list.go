package postgres

import (
	"fmt"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) TeacherRewardList(req constant.TeacherRewardRequest, pagination *helper.Pagination) ([]constant.TeacherRewardResponse, error) {
	query := `
	SELECT DISTINCT ON ("trt"."id")
	"trt"."id" AS "reward_id",
	"trt"."item_id",
	"i"."type",
	"i"."name",
	"i"."description",
	"i"."image_url",
	"trt"."amount",
	"trt"."created_at" AS "sended_at",
	"u"."first_name" AS "sended_from",
	"trt"."status"
	FROM "teacher_item"."teacher_reward_transaction" trt
	LEFT JOIN "item"."item" i
		ON "trt"."item_id" = "i"."id"
	LEFT JOIN "user"."user" u
		ON "trt"."created_by" = "u"."id"
	LEFT JOIN "subject"."subject_teacher" st
		ON "trt"."subject_id" = "st"."subject_id"
		AND "trt"."teacher_id" = "st"."teacher_id"
	LEFT JOIN "subject"."subject" s
		ON "st"."subject_id" = "s"."id"
	WHERE "trt"."student_id" = $1
	AND "trt"."status" = 'send'
	AND "trt"."is_deleted" = false
	AND "s"."id" = $2
	AND "trt"."created_at" <= $3

	`
	currentTime := time.Now().UTC()
	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRow(countQuery, req.StudentId, req.SubjectId, currentTime).Scan(&pagination.TotalCount)
	if err != nil {
		return nil, err
	}
	query += fmt.Sprintf(` ORDER BY "trt"."id" LIMIT $4 OFFSET $5`)
	response := []constant.TeacherRewardResponse{}
	err = postgresRepository.Database.Select(&response, query, req.StudentId, req.SubjectId, currentTime, pagination.Limit, pagination.Offset)
	if err != nil {
		return nil, err
	}
	return response, nil
}
