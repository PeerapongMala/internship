package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ListSubjectLesson(pagination *helper.Pagination, subjectId int, filter constant.LessonListFilter) (*[]constant.SubjectLessonResponse, error) {
	response := []constant.SubjectLessonResponse{}
	query := `
		SELECT
			sl.id,
			COUNT(DISTINCT("lsr"."level_id")) AS "rewarded_stage_count",
			sl.subject_id,
			sl.index,
			sl.name,
			sl.font_name,
			sl.font_size,
			sl.status,
			sl.background_image_path,
			sl.created_at,
			sl.created_by,
			sl.updated_at,
			sl.updated_by,
			sl.admin_login_as,
			sl.wizard_index,
			u.id AS user_id,
			u.email AS email,
			u.title AS title,
			u.first_name AS first_name,
			u.last_name AS last_name
		FROM "subject"."lesson" sl
		LEFT JOIN "user"."user" u ON sl.updated_by = u.id
		LEFT JOIN "level"."level" l ON "sl"."id" = "l"."sub_lesson_id"
		LEFT JOIN "level"."level_special_reward" lsr ON "l"."id" = "lsr"."level_id"
		WHERE sl.subject_id = $1
	`
	args := []interface{}{subjectId}
	argsIndex := 2

	if filter.Status != nil {
		query += fmt.Sprintf(` AND "sl".status = $%d`, argsIndex)
		args = append(args, *filter.Status)
		argsIndex++
	}
	if filter.SearchText != nil {
		query += fmt.Sprintf(` AND "sl".name ILIKE $%d`, argsIndex)
		args = append(args, "%"+*filter.SearchText+"%")
		argsIndex++
	}
	if !filter.StartDate.IsZero() {
		query += fmt.Sprintf(` AND "sl"."created_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if !filter.EndDate.IsZero() {
		query += fmt.Sprintf(` AND "sl"."created_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}

	query += ` GROUP BY "sl"."id", "u"."id"`

	// log.Println("query", query, lessonId)
	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "sl"."index" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	// log.Println("query", query)
	// log.Println("args", args)
	err := postgresRepository.Database.Select(&response, query, args...)
	// log.Println("response", response)
	// log.Println("err", err)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &response, nil
}
